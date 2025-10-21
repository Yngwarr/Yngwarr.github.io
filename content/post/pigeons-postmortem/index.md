---
draft: true
title: ""
date: 2025-10-21
category: postmortem
---

{{< rawhtml >}}

<iframe frameborder="0" src="https://itch.io/embed/3954118?bg_color=333941&amp;fg_color=ffffff&amp;link_color=afbfd2&amp;border_color=6f7882" width="552" height="167"><a href="https://yngvarr.itch.io/pigeons-arent-real">Pigeons aren't Real by Yngvarr, syudzius</a></iframe>

{{< /rawhtml >}}

A little over a week ago we released a game called *Pigeons aren't Real*. In this devlog I'll  describe the development process and share some insights I gained from it.

We made this game as an entry for a *Regional GameDev Hackathon* that took place offline, in a beautiful city of Podgorica. As always, we participated as a team of two, with [syudzius] being an artist and me doing the programming.

The theme was *"watching"* and we liked it. Honestly, as a person who used to only jam in Ludum Dares, I'm not used to this kind of treats. :) Not to say we didn't struggle through the process of searching for the idea, but still, it only took us a couple of hours, not a whole day as it did on a previous Global Game Jam. We had a couple of generic ideas, a couple really promising ones with questionable scope, but once we reached The Idea, we instantly locked on it.

![Mindmaps for ideas used to be much bigger.]()

If you already played this game (thank you!) you know which idea won: shooting surveillance drones that pretend to be pigeons in a Moorhuhn-like action (game-design-wise it turned out to be more similar to [Hidden in Plain Sight][hidden], which is even better). We liked the idea because it seemed easy to implement, trivial to explain and fun to play.

Most of the development time we spent dealing with pigeons: programming them to move around and do stuff and drawing frame-by-frame animations for actions. After a couple of concepts, my wife chose the cartoonish style she excels at for drawing. We had a lot of fun imagining miriads of things pigeons would do, but in the end decided to concentrate on three suspicious actions for robots and two innocent ones for pigeons.

![Sketches are a big part of game making](https://img.itch.zone/aW1nLzIzNzA2NTcyLnBuZw==/original/IhxaUC.png)

On the programming side, pigeons turned out to be the purest case of finite state machine, or FSM for short. Luckily, this spring I spent some time implementing a FSM for an unreleased vending machine game, so I took the code from there. I can't overestimate the importance of that learning project for this jam: not only did it provide me with a well-documented battle-tested library to use, it also helped me see the FSM behind the pigeon's logic. Always do your learning projects, even if you know they may never see the light of day! Still helps a lot! :)

![States of pigeons](https://img.itch.zone/aW1nLzIzNzA2NTczLnBuZw==/original/kh64DY.png)

Despite the simplicity of a state machine, programming pigeons wasn't as trivial as I expected. For example, there are 3 different types of idle animations: basic ones that can just be played with no problem, looped ones that stop on timer, and a convoluted looped one with extra intro and outro animaitons. All of these are handled by a single state and need to be accounted for. This single state turned out to be the most error-prone part of the entire game's codebase.

Balancing the game was also a tricky process: we mostly went by intuition, but a last-moment playtest shown that we were too careful with the difficulty, to the point of making the game boring. We managed to squeeze one little value change literally in the last minutes of the game jam, making the game more chaotic and fun. Don't be like us! Playtest early, playtest often, have a game over condition as soon as you can!

Despite all the trouble, the game turned out to be very fun and also hilarious! Shout out to [syudzius] for picking and adding sounds to the game, they played a critical role in the "hilarious" part. She also added a tutorial, which is a very important feature we often overlook.

As promised, key insights:
- Learning projects are the giants you stand on the shoulders of. Even if you don't feel like reusing previously written code in game jams, investing time into learning helps you load concepts in your brain and opens possibilities you'd never noticed otherwise.
- Tutorials are important, even for games that seem simple to pick up.
- As I said: playtest early! Which means that you want to have something playable as early as you can. Rough, imperfect, placeholder-ridden, but playable.
- An artist who knows how to code is an unstoppable game-making beast.

If you read this far, thank you, I hope it was interesting! You can have this tangerine: 🍊. Check out the game and keep being awesome!

[syudzius]: https://syudzius.itch.io/
[hidden]: https://store.steampowered.com/app/303590/Hidden_in_Plain_Sight/
