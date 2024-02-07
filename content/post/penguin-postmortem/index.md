---
draft: true
title: "Ludum Dare 49 post-mortem (penguin.exe)"
date: 2021-10-13
category: postmortem
---

So it happened: my 10th Ludum Dare in a row. And I wouldn't be myself if I
didn't come up with something special that day.

Once again we participated in _jam_ category and, honestly, this felt like the
most productive entry of all. We had a blast!

## What did we do?

This year's theme, _Unstable_, turned out to be pretty decent. We came up with
several ideas during breakfast, but were fast to realize that they all were
either too shallow, or too cumbersome to implement. With that we turned to [Jonas
Tyroller's method][jonas] of coming up with ideas: we just thrown several
interpretations to the mindmap and tried digging deeper on the ideas we liked.
And suddenly, we came up with a great concept that had nothing to do with the
things we investigated. But that concept was up our alley, so we decided to
commit to it.

[jonas]: https://www.youtube.com/watch?v=xe2X0WJgI-4

{{< figure src="mindmap.png"
    alt="Sloppily connected tiles of the road in Godot editor."
    caption="The method have been proven to work!">}}

The concept was simple: player has a computer desktop that contains several
folders, files and the recycling bin. At some point, the dektop gets invaded by
small havoc-wreaking penguins. Penguins do all sorts of stuff: they throw files
around, order pineapple pizza over the internet, play pong with each other, draw
~~erotics~~ in Paint and do other RAM and CPU heavy stuff. Player has to dump
penguins into the bin and clean up the mess before their PC runs out of
resources and end up with nothing but a Blue Screen of Death. The idea seemed to
be straightforward to implement, easy to pick up and interesting enough to
commit to it. And that exactly what we ded.

Once again, I decided to disregard my own rule and make a game in vanilla
JavaScript instead of Godot. This decision was mostly dictated by my desire to
cut the corner: I knew about several CSS libraries imitating old-school windows
styles ([98.css][98], [XP.css][xp], [7.css][7], you name it) and even examples
of full-fledged OS emulators I can ~~steal features~~ get guidance from (for
example, I peeked on [Windows 93][win93]'s multifile selection style).

[98]: https://jdan.github.io/98.css/
[xp]: https://botoxparty.github.io/XP.css/
[7]: https://khang-nd.github.io/7.css/
[win93]: https://www.windows93.net/

However, the lack of the engine meant that I had to come up with basic features
myself. That's how I found out that JS doesn't have a simple way to draw sprite
animations, so I had to create empty `<div>`s with constant sizes and change
their background coordinates every frame. And that's basically how it works in
game engines, the problem is that in plain JS it involves a lot of string
parsing on the browser's side, just because browsers' API works this way. This
sure works, but has an infinite potential for improvement. :(

And while I was busy figuring out how Windows 93's multifile selection works, my
wonderful wife got fed up with Photoshop and started experimenting with
Aseprite.
