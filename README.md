# WaLang

WaLang is a programming language. This repo is the version as WhatsApp bot.

## How to use

To use this programming language in WhatsApp bot form, you should paste the code inside the console of the WhatsApp tab. You can find the code with each release inside `walang.min.js` (or if you prefer the readable but much bigger version, you can find it in `walang.js`). To run the latest build you can also pick those files from the build folder in source code, but it might not be stable and working.  
Once you have pasted the code in the console, you're done and the bot should be working.

## How does the bot work?

The bot is using [this](https://github.com/kiipy/whatt) library. To execute a command, type a '!' in prefix of the command.  
List of commands:
- help: Shows a help message.
- program: Define a program. Usage: `!program <name> <code...>`. It is good practice to put a newline between the code and the rest of the command.
- run: Run a program. Usage: `!run <name>`. Another usage is to react to the message where the program is defined using only `!run`.

## How does the programming language work?

The programming language has no documentation yet.
