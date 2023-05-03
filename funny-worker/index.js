const jokes = [
  {
    id: "0189hNRf2g",
    joke: "I'm tired of following my dreams. I'm just going to ask them where they are going and meet up with them later.",
  },
  {
    id: "08EQZ8EQukb",
    joke: "Did you hear about the guy whose whole left side was cut off? He's all right now.",
  },
  {
    id: "08xHQCdx5Ed",
    joke: "Why didn’t the skeleton cross the road? Because he had no guts.",
  },
  {
    id: "0DQKB51oGlb",
    joke: "What did one nut say as he chased another nut?  I'm a cashew!",
  },
  {
    id: "0DdFQZgyXnb",
    joke: "Where do fish keep their money? In the riverbank",
  },
  {
    id: "0DdaxAX0orc",
    joke: "I accidentally took my cats meds last night. Don’t ask meow.",
  },
  {
    id: "0DtrrOZDlyd",
    joke: "Chances are if you' ve seen one shopping center, you've seen a mall.",
  },
  {
    id: "0L6MexPukjb",
    joke: "Dermatologists are always in a hurry. They spend all day making rash decisions. ",
  },
  {
    id: "0LuXvkq4Muc",
    joke: "I knew I shouldn't steal a mixer from work, but it was a whisk I was willing to take.",
  },
  {
    id: "0gFdFBsWDd",
    joke: "I won an argument with a weather forecaster once. His logic was cloudy...",
  },
  {
    id: "0ga2EdN7prc",
    joke: "How come the stadium got hot after the game? Because all of the fans left.",
  },
  {
    id: "0ga2wsPZgib",
    joke: '"Why do seagulls fly over the ocean?" "Because if they flew over the bay, we\'d call them bagels."',
  },
  {
    id: "0oO71TSv4Ed",
    joke: "Why was it called the dark ages? Because of all the knights. ",
  },
  {
    id: "0oz51ozk3ob",
    joke: "A steak pun is a rare medium well done.",
  },
  {
    id: "0ozAXv4Mmjb",
    joke: "Why did the tomato blush? Because it saw the salad dressing.",
  },
  {
    id: "0wcFBQfiGBd",
    joke: "Did you hear the joke about the wandering nun? She was a roman catholic.",
  },
  {
    id: "189xHQ7pOuc",
    joke: "What creature is smarter than a talking parrot? A spelling bee.",
  },
  {
    id: "18Elj3EIYvc",
    joke: "I'll tell you what often gets over looked... garden fences.",
  },
  {
    id: "18h3wcU8xAd",
    joke: "Why did the kid cross the playground? To get to the other slide.",
  },
  {
    id: "1DIRSfx51Dd",
    joke: "Why do birds fly south for the winter? Because it's too far to walk.",
  },
  {
    id: "1DQZDY0gVnb",
    joke: "What is a centipedes's favorite Beatle song?  I want to hold your hand, hand, hand, hand...",
  },
  {
    id: "1DQZvXvX8Ed",
    joke: "My first time using an elevator was an uplifting experience. The second time let me down.",
  },
  {
    id: "1DQZvcFBdib",
    joke: "To be Frank, I'd have to change my name.",
  },
  {
    id: "1Dt4M7Ufaxc",
    joke: "Slept like a log last night … woke up in the fireplace.",
  },
  {
    id: "1LmOKBIJYob",
    joke: "What do you call a female snake. misssssssss ",
  },
  {
    id: "1T01LBXLuzd",
    joke: "Why does a Moon-rock taste better than an Earth-rock? Because it's a little meteor.",
  },
  {
    id: "1T0gqOZT0g",
    joke: "I thought my wife was joking when she said she'd leave me if I didn't stop signing \"I'm A Believer\"... Then I saw her face.",
  },
  {
    id: "1TfNRKexAd",
    joke: "I’m only familiar with 25 letters in the English language. I don’t know why.",
  },
  {
    id: "1gyI6EIRKBd",
    joke: "What do you call two barracuda fish?  A Pairacuda!",
  },
  {
    id: "1gyskqz51ob",
    joke: "What did the father tomato say to the baby tomato whilst on a family walk? Ketchup.",
  },
];

export default {
  async fetch(request) {
    const url = new URL(request.url);
    let json = JSON.stringify(jokes);

    /**
     * /random returns a single, random joke from our array
     */
    if (url.pathname === "/random") {
      json = JSON.stringify(
        jokes[Math.floor(Math.random() * jokes.length)]["joke"]
      );
      return new Response(json, {
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
      });
    } else {
      /**
       * default is to return all jokes
       */
      return new Response(json, {
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
      });
    }
  },
};
