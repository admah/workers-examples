/**
 * An example of how a Worker can validate and
 * interact with Cloudflare Access JWT
 *
 * Taken from the Cloudflare Access Pages Plugin
 * found here: https://developers.cloudflare.com/pages/platform/functions/plugins/cloudflare-access/
 */

const getIdentity = async ({ jwt, domain }) => {
  const identityURL = new URL("/cdn-cgi/access/get-identity", domain);
  const response = await fetch(identityURL.toString(), {
    headers: { Cookie: `CF_Authorization=${jwt}` },
  });
  if (response.ok) return await response.json();
};

const generateLoginURL = ({ redirectURL, domain, aud }) => {
  const redirect =
    typeof redirectURL === "string" ? new URL(redirectURL) : redirectURL;
  const { hostname } = redirectURL;
  const loginPathname = `/cdn-cgi/access/login/${hostname}?`;
  const searchParams = new URLSearchParams({
    kid: aud,
    redirect_url: redirect.pathname + redirect.search,
  });
  return new URL(loginPathname + searchParams.toString(), domain).toString();
};

const generateLogoutURL = ({ domain }) =>
  new URL(`/cdn-cgi/access/logout`, domain).toString();

const extractJWTFromRequest = (request) =>
  request.headers.get("Cf-Access-Jwt-Assertion");

// Adapted slightly from https://github.com/cloudflare/workers-access-external-auth-example
const base64URLDecode = (s) => {
  s = s.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "");
  return new Uint8Array(
    Array.prototype.map.call(atob(s), (c) => c.charCodeAt(0))
  );
};

const asciiToUint8Array = (s) => {
  let chars = [];
  for (let i = 0; i < s.length; ++i) {
    chars.push(s.charCodeAt(i));
  }
  return new Uint8Array(chars);
};

const generateValidator =
  ({ domain, aud }) =>
  async (request) => {
    const jwt = extractJWTFromRequest(request);

    const parts = jwt.split(".");
    if (parts.length !== 3) {
      throw new Error("JWT does not have three parts.");
    }
    const [header, payload, signature] = parts;

    const textDecoder = new TextDecoder("utf-8");
    const { kid, alg } = JSON.parse(
      textDecoder.decode(base64URLDecode(header))
    );
    if (alg !== "RS256") {
      throw new Error("Unknown JWT type or algorithm.");
    }

    const certsURL = new URL("/cdn-cgi/access/certs", domain);
    const certsResponse = await fetch(certsURL.toString());
    const { keys } = await certsResponse.json();

    if (!keys) {
      throw new Error("Could not fetch signing keys.");
    }
    const jwk = keys.find((key) => key.kid === kid);
    if (!jwk) {
      throw new Error("Could not find matching signing key.");
    }
    if (jwk.kty !== "RSA" || jwk.alg !== "RS256") {
      throw new Error("Unknown key type of algorithm.");
    }

    const key = await crypto.subtle.importKey(
      "jwk",
      jwk,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const unroundedSecondsSinceEpoch = Date.now() / 1000;

    const payloadObj = JSON.parse(textDecoder.decode(base64URLDecode(payload)));

    if (payloadObj.iss && payloadObj.iss !== certsURL.origin) {
      throw new Error("JWT issuer is incorrect.");
    }
    if (payloadObj.aud && !payloadObj.aud.includes(aud)) {
      throw new Error("JWT audience is incorrect.");
    }
    if (
      payloadObj.exp &&
      Math.floor(unroundedSecondsSinceEpoch) >= payloadObj.exp
    ) {
      throw new Error("JWT has expired.");
    }
    if (
      payloadObj.nbf &&
      Math.ceil(unroundedSecondsSinceEpoch) < payloadObj.nbf
    ) {
      throw new Error("JWT is not yet valid.");
    }

    const verified = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      key,
      base64URLDecode(signature),
      asciiToUint8Array(`${header}.${payload}`)
    );
    if (!verified) {
      throw new Error("Could not verify JWT.");
    }

    return { jwt, payload: payloadObj };
  };

export default {
  async fetch(request) {
    const domain = "https://test.cloudflareaccess.com";
    const aud =
      "4714c1358e65fe4b408ad6d432a5f878f08194bdb4752441fd56faefa9b2b6f2";
    const jwt =
      "eyJhbGciOiJIUzI1NiIsImtpZCI6IjkzMzhhYmUxYmFmMmZlNDkyZjY0NmE3MzZmMjVhZmJmN2IwMjVlMzVjNjI3YmU0ZjYwYzQxNGQ0YzczMDY5YjgiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOlsiOTdlMmFhZTEyMDEyMWY5MDJkZjhiYzk5ZmMzNDU5MTNhYjE4NmQxNzRmMzA3OWVhNzI5MjM2NzY2YjJlN2M0YSJdLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiZXhwIjoxNTE5NDE4MjE0LCJpYXQiOjE1MTkzMzE4MTUsImlzcyI6Imh0dHBzOi8vdGVzdC5jbG91ZGZsYXJlYWNjZXNzLmNvbSIsIm5vbmNlIjoiMWQ4MDgzZjcwOGE0Nzk4MjI5NmYyZDk4OTZkNzBmMjA3YTI3OTM4ZjAyNjU0MGMzOTJiOTAzZTVmZGY0ZDZlOSIsInN1YiI6ImNhNjM5YmI5LTI2YWItNDJlNS1iOWJmLTNhZWEyN2IzMzFmZCJ9.05vGt-_0Mw6WEFJF3jpaqkNb88PUMplsjzlEUvCEfnQ";
    /**
     * Get more information about a given user’s identity
     *
     * @returns {Response}
     */
    const identity = await getIdentity({
      jwt,
      domain,
    });
    return new Response(`Hello, ${identity?.name || "service user"}!`);

    /**
     * Generate a login URL and redirect the user
     *
     * @param {any} redirectURL
     * @param {any} domain
     * @param {any} aud
     *
     * @returns {Response}
     */
    // 	const loginURL = generateLoginURL({
    // 		redirectURL: "https://example.com/greet",
    // 		domain,
    // 		aud,
    // 	});
    // 	return new Response(null, {
    // 		status: 302,
    // 		headers: { Location: loginURL },
    // 	});

    /**
     * Generate a logout URL
     *
     * @returns {Response}
     */
    // return new Response(null, {
    // 	status: 302,
    // 	headers: {
    // 		Location: generateLogoutURL({
    // 			domain,
    // 		}),
    // 	},
    // });

    /**
     * Validate the user and redirect or return a 403
     *
     * @returns {Response}
     */
    // try {
    // 	const validator = generateValidator({ domain, aud });

    // 	const { jwt, payload } = await validator(request);

    // 	data.cloudflareAccess = {
    // 		JWT: {
    // 			payload,
    // 			getIdentity: () => getIdentity({ jwt, domain }),
    // 		},
    // 	};

    // 	return next();
    // } catch {}

    // return new Response(null, {
    // 	status: 302,
    // 	headers: {
    // 		Location: generateLoginURL({ redirectURL: request.url, domain, aud }),
    // 	},
    // });
  },
};
