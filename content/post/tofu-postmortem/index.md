---
draft: false
title: "Ludum Dare 53 post-mortem (Early Morning Tofu Delivery)"
date: 2023-06-01
category: postmortem
---

My 14th Ludum Dare in a row have finally finished and it was a wild experience!
It was the first time I made a 3D game with Godot and also the very first time I
used Godot 4, which turned out to be a bit unstable, but pretty usable.

As always, I teamed up with my wonderful artist, [Syudzius][syu], to take part
in our 10th Ludum Dare together. The theme was _Delivery_ and we made the game
called _Early Morning Tofu Delivery_.

[syu]: https://twitter.com/syudzius "artist's twitter"

{{< rawhtml >}}

<iframe src="https://itch.io/embed/2048324?linkback=true" width="552"
height="167" frameborder="0"><a
href="https://yngvarr.itch.io/early-morning-tofu-delivery">Early Morning Tofu
Delivery by yngvarr</a></iframe>

{{< /rawhtml >}}

## What did we do?

Funny story about the theme is that we've decided on the idea _before_ the theme
anouncement. We didn't brainstorm beforehand, mind you, I just said _"you know,
if 'Delivery' wins, we're making a game about delivering tofu from the top of
the mountain"_ as a joke about one of our favorite [anime series][initial-d]. I
was expecting _"The health bar is more than just a health bar"_ to be the final
theme, as the most eye-catching one of the final round. Luckily, it didn't
happen!

[initial-d]: https://myanimelist.net/anime/185/Initial_D_First_Stage "Initial D"

Shortly after the announcement we decided to commit to our joke idea. I've
always wanted to create a racing game, but my previous attempt with Unity didn't
work out, so I was eager to check what Godot 4 has to offer in this regard. On
the contrary, my artist wasn't so happy about making the 3D game, as she had no
prior experience with Blender. After a short discussion, we found the common
ground in using third-party assets for everything 3D.

Programming turned out to be the easiest part of the jam. I spent the most of
the time tweaking physics, generating collision shapes and building the track.
The latter was the most exhausting: I used [Kenney's tile pack][road-pack] to
create the road and didn't bother with procedural generation. So, every tile is
placed by my not very precise hand, leaving little imperfections in every tile's
position. It's not a problem when you have a straight road with no
intersections, but I wanted a branching path for more variety and replayability.
Unsurprisngly, I ended up unable to merge branches back, so I had to introduce a
very sloppy diagonal on one of the junctions. If you're making a racing game,
don't be like me, make something more clever.

[road-pack]: https://kenney.nl/assets/city-kit-roads "City Kit (Roads)"

{{< figure src="sloppy.png"
    alt="Sloppily connected tiles of the road in Godot editor."
    caption="Almost unnoticable, but still sloppy.">}}

Figuring out the vehicle physics was tricky, but didn't feel like a burden. It
was more of a research, finding out how values affect the vehicle and trying to
achieve the particular feeling. I knew that making the car drift and not spin
out would take much more effort than I'd be willing to put in, instead I wanted
the car to feel heavy and to require precise throttle control. I took reference
from a [real car][car-spec], made most of the values match its specification,
and carefully modified some of them to match the desired feel. Somehow, I
managed to create a satisfying handling setup.

[car-spec]: https://www.suzuki.co.th/en/model/carry/specification "Suzuki Carry"

{{< figure src="real-car.png"
    alt="Real car asks a low-poly car what it is. Low-poly one answers 'I am you!'"
    caption="Less polygons, more fun!">}}

As a side-note, I want to mention that Godot's default values for
vehicle-related nodes are inadequate to say the least. Luckily, the
documentation provides examples and explainations for the most of them, so if
you plan to make a car game in Godot, don't get discouraged when the car doesn't
behave from the get-go. Read the docs, make some tweaks and it will eventually
click.

{{< figure src="godot-default.png"
    alt="The default value of suspension_travel in Godot docs is 5.0. The very same docs recommends to set it between 0.1 and 0.3."
    caption="I mean, come on! It's 4 lines below!">}}

While I was busy building roads and tweaking physics, my artist was had her own
research going: she was creating visual effects, such as tire smoke and
checkpoints. She had no prior knowledge of Godot Engine and had to learn it on
the fly. And she succeeded! From a vague description of what I want checkpoints
to look like, she was able to create a beauty I did not expect.

{{< figure src="checkpoint.png"
    alt="Square-shaped checkpoint."
    caption="It looks even better when animated!">}}

We wanted the game to take place in the early morning, before the sunrise. It
was a good excuse to test the new Godot renderer and also gain some experience
working with lights. I had much fun setting up the headlights and making
checkpoints shine, and the resulting style of the game made it stand out.

The last day was spent making sounds, finding music and trying to fit as much
mountains in our game to match the reference. Coincidentally, we spent a part of
that day in a trip to local mountains with our friends, so by the time we got
back to work, we knew how the mountain road should look like. We also knew that
our game won't look anything close. `X_X`

## How did it end up?

### The good

* **The theme**. It was the second time we didn't really bother searching for
    the perfect idea and picked the first workable one instead. It doesn't mean
    we gave up on trying to approach the theme creatively, but sometimes we just
    want to make a particular game, no matter how boring its theme
    interpretation is.

* **Free assets**. It took me several game jams to embrace the inevitable and
    start using free assets with no shame. I still have a dream of making the
    whole game myself, but right now it's more important to focus on making
    better games. Once we can do it consistently, I'll be able to concentrate
    on assets quality.

* **Polish.** Our entries seem to be more and more polished with every jam
    we're participating in. It's not obvious if you compare with the latest
    entries, but I can feel the attention shift from simply implementing the
    game to making it pleasant to play. It happens naturally, but I think
    settling on Godot as an engine of choice was the important decision that
    allows us to grow faster in this regard.

* **Engine choice.** While Godot 4 is still considered unstable, I'm glad I took
    the risk. In the end, I got accustomed to it during the jam and shouldn't
    have problems digging deeper in the future.

### The bad

* **Timing.** Sadly, we had to crunch this time. I don't know if we'd have to,
    if not for the trip, but skipping it was out of the question.

* **Scope.** You know you overscope if you plan to add the achievements to your
    jam game. I swear, I had the implementation in mind for the most of the jam,
    it should've been easier than making mountains in Blender! But, as it
    happens so often, small details and lurking bugs don't take much time
    individually, but are so large in numbers, that by the time you're done with
    them, you have no time for extra features.

* **Sounds.** The engine's sound was tricky to figure out. I wanted to synthesize
    this sound so badly, mainly because I saw that [AngeTheGreat's video][engine-sound]
    where he explains, why the most of the engine sounds suck. Well, I made it
    suck even more by using an idle engine sample and adjusting its pitch based
    on the car's speed. It's so wrong on multiple levels, but in a jam setting,
    I should care less about it.

* **Music.** It had to be eurobeat, but I didn't manage to find a single
    royalty-free track. I had to find something else, and to be honest, the end
    result turned out pretty sick! Now it sounds more like the old _Need for
    Speed_ game and has some charm besides the only pop-culture reference. But
    the need to rely on someone's else music is starting to bug me.

* **3D.** Yeah, that's too much dimensions for us. While I was having a blast
    making my first 3D game in Godot, my partner was struggling way out of her
    domain. So, despite the game ending up being good and both of us are happy
    about it, we decided to concentrate on stylish 2D games in the future.

[engine-sound]: https://youtu.be/RKT-sKtR970 "Engine Sound Simulator"

## Outro

So, how good is the game for a 14th entry? An anxious part of me doubts that
we're making enough progress, expecially since we ended up ranking lower than
our first entries.

But then I remember that the point of game jams is to have fun and our real goal
is to get better than we were before. In this regard, we're making a huge
progress: we're better at communicating, our games have already acquired their
unique style, we finally settled on using Godot for all our jams (despite the
recent digressions) and the quality of our games is increasing with every jam.
And that's what really matters.

***

Thank you for reading! If you want to see the process of making this game, check
out this timelapse. It only shows my perspective, but you may still find it
entertaining.

{{< rawhtml >}}

<iframe width="560" height="315" src="https://www.youtube.com/embed/S0HHU6Cbmog"
title="YouTube video player" frameborder="0" allow="accelerometer; autoplay;
clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
allowfullscreen></iframe>

{{< /rawhtml >}}
