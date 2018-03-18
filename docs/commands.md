---
layout: md
title: Commands
group: nav
order: 2
permalink: /commands/
header: ["Command List"]
---

# Commands

A list of commands that can be used on this bot. `<angle brackets>` denote options you have to pass to the command for it to work, and `[square brackets]` denote optional parts that can be omitted.

**Note:** This list uses the prefix `~` (a tilde), which is the bot's default prefix but may not be the same as the prefix set for any given server. When in doubt, mention the bot at the beginning of your message instead of using a prefix - this is valid in any server.

## `~about`
Displays information about the bot, including running version, time since last crash, and a link to its source code.

## `~choose <option>, <option>, [more options...]`
Chooses a random option from a list of comma-separated options. If you want to include a comma in an option, escape it with a backslash.

## `~color <any valid CSS color>`
Gets alternate writings of a CSS color, plus a preview.

## `~eval` (`~rb`, `~py`, `~js`, and others)
Evaluates arbitrary code in a sandbox. Supports Ruby, Python, and Javascript code in a variety of formats.

Code can be passed to this command in several ways:

- Passing code in a code block with a specified language

	````
	~eval ```rb
	puts "hoi"
	```
	````

	````
	~eval ```py
	print("hoi")
	```
	````

- Using a language-specific alias, with or without a code block

	````
	~ruby puts "hoi"
	````

	````
	~python ```py
	print("hoi")
	```
	````

	````
	~js console.log('hoi')
	````

The output of this command reflects the result of the run script. Console messages (`puts`, `print()`, `console.log()`) are shown with comments, and the final output of the script will be shown with syntax highlighting.

Due to limitations in the evaluation system, asynchronous scripts will likely not work.

## `~help [command]`
Displays a list of commands. Include a command name to get information about that command.

## `~npm [search]`
Searches for, and get information on, npm packages.

## `~ping`
Pings the bot.

## `~roll <dice roll>`
Roll some dice. Pass in a number or an `AdX` roll, with modifiers and `d%` format supported. Examples: `6`, `2d20`, `1d%`, `d4-2`. If no roll is specified, it will default to `1d6`. Pass in multiple rolls by separating them with spaces.
