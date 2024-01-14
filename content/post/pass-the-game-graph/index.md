---
draft: true
title: "A graph visualization for Pass the Game challenge"
date: 2023-08-01
---

In the end of July I took part at [Blackthornprod]'s Pass the Game Jam. It's a
crowd version of their youtube series "[Making a game without
communicating][series]" with some changes in rules to make it work for a jam
format. You're not allowed to discuss your game with any developer of the
prototype you're working on, you're required to work on a prototype from a
previous day, you don't have to participate in every day of the competition and
it's perfectly fine work as a team with someone, who didn't work on the game
you're extending before.

[blackthornprod]: https://www.youtube.com/@Blackthornprod
[series]: https://www.youtube.com/playlist?list=PLBIb_auVtBwCNnbmuppsBJdulUZmW0Cfu

My participation was pretty limited: I scraped a prototype for day 1, run into a
nasty bug in Godot 4 (should've seen it coming, really, but it caught me by
surprise) and then added music to the game my friends have started. Not very
productive, but the best I could do.

After the third day ended I found myself wondering: what would a connection
graph of all entries look like. Probably, there would be a lot of day 1 entries
without the continuation, a few big trees originating in one starting point and
perhaps several chains that didn't survive to the final day.

Long story short, I made a [graph view]!

[graph view]: http://hardweird.net/pass-the-game-graph/

{{< rawhtml >}}
<iframe src="http://hardweird.net/pass-the-game-graph/?hide-help=1" width="720"
height="720" frameborder="0"></iframe>
{{< /rawhtml >}}

<!-- TODO add a static image for mobile devices -->

It's interactive, you can move dots around (in fact, you need to do it to
untangle this mess; let's consider it an unintended game mechanic :) ). Nodes
represent jam entries, different colors are for different days.

## Analysis (kinda)

I've had several assumptions regarding the shape of the graph before creating
it, and some of them turned out to be true:

- There are many day 1 entries that wasn't picked up by anyone on day 2. It
  It shouldn't be a surprise, since less people signed up for day 2 compared to
  day 1. We ended up with 255 day 1 submissions and only 171 day 2 ones. Recall
  that some of day 1 prototypes have more than 1 successor and you'll end up
  with over 100 lonely day 1 entries (142, actually, if my calculations are
  correct).

- There are several huge game trees that branch almost every day! [Drifty Car],
  [UFO], [Physics Parkour Telekinesis Project][parkour], [3D Zombie
  Shooter][zombie] and half a dozen other first-day prototypes that have a huge
  lineage of branching entries show that your prototype must be appealing for it
  to be continued. Almost like in real life! :D

  It's interesting to see, however, that _appeal_ is not about your game's page
  being all shiny and neat — it's enough to show a nice screenshot or, even
  better, to provide a playable build. And it makes a perfect sense, as you're
  trying to catch an eye of a fellow developer, not a player's one. It's enough
  to show a solid foundation and an intriguing mechanic to spark one's
  imagination and make them pick your entry among others.

[drifty car]: https://shadoweeq.itch.io/drifty-car
[ufo]: https://nutty-studios.itch.io/unity-ufo-inverted-tower-defence
[parkour]: https://tudypie.itch.io/3d-physics-parkour-project-unity
[zombie]: https://cyzeck.itch.io/3d-zombie-shooter-base-day-one

Graph also have shown some surprising insights:

- Day 6 entries tend to stick to the same ancestors more compared to all other
  days. Despite that, median numbers of direct children for every day equal to 1.
  This means, people tend to spread the effort over many games, resulting in a
  variety of options to choose from each day. Which is great!

- There are several straight chains of games, some even made it all the way to
  day 6! I didn't expect to see such chains, since it seems unlikely for a game
  to attract exactly one person every day. Great luck!

## How does the graph work?

And now for the interesting part: the backstage! First of all, I knew there
should be some way to get everything I need from itch.io without much hassle.
So, the first thing I tried was go to the jam's [entry page] and add `.json` to
its url. If it sounds a bit arbitrary to you, well, it is, but I knew you can do
it with reddit so why not to try it here. Surprisingly, it kinda worked!

[entry page]: https://itch.io/jam/day-6/entries

```json
{"errors":["jam_id: expected integer"]}
```

Now when we know there is the API we're looking for, time to unwrap the
browser's devtools. Open the _Network_ tab, filter XHR requests and reload the
page. That's how I found out the url I needed was `https://itch.io/jam/380912/entries.json`.
What surprised me that there is no pagination implemented on the itch.io's side.
It shouldn't be the issue for the such small jams, but what about the larger
ones, like [GMTK] nearly 7000 entries?

[gmtk]: https://itch.io/jam/gmtk-2023/entries

Anyway, after figuring out the API, we have all the submissions on our hands.
Next we proceed to scrape every

<!-- That's how I made the view: -->
<!-- - Added .json to an entry page url to realize there's actually an api I'm -->
<!--     looking for. -->
<!-- - Used the correct url to download the list of all entries (no paging whatsoever) -->
<!-- - Scraped every listed page for links in the description -->
<!-- - Some people post links to entries, some — to games. Also, needed a way to filter -->
<!--     out irrelevant links. Solution: index. Consistent link is an entity one -->
<!--     because it's trivial to sort by day -->
<!-- - Building the links: we want a tree, so store links only one step back, use -->
<!--     sorting to determine which entry to link to -->
<!-- - Some people wouldn't post links or will post them incorrect. That's why I -->
<!--     scrape with one script and show with another -->
<!-- - For visuals, I took someone else's d3 code and modified it a bit to show the -->
<!--     info -->
<!---->
<!-- Problems I didn't expect -->
<!-- - people leave links to their own entries. -->
<!-- - people leave links to all the entries in a branch -->
<!-- - some link queue, which I didn't know about -->
<!---->
<!---->
<!-- What could be made better: -->
<!-- - search for a game by a name or an author -->
<!-- - highlight the current tree, show its stats (e. g. total count of nodes in it) -->
<!-- - untangle it automatically -->
