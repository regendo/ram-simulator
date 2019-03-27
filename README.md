# RAM Simulator

Parses and executes a RAM program.

## Usage

Load your program, your optional input string, and optional pre-set memory. If the program passes the syntax parser, you can then run it step-by-step or all at once. Reset the program to the start by simply loading it again.

Comments preceded by `//` are ignored, as are empty lines. Be aware though that lines without commands are completely ignored and do not count toward the line count. The following program evaluates to only 10 lines (the empty lines and the ones that only contain the comment are discarded), with `read` being line 1 and `end` being line 10. The jump to line 10 thus correctly jumps to the `end` command.

```ram
// A program that echoes every 'A' and 'B' of the input but removes everything else.
// Input needs to be terminated by '#'.
read // reads and removes 1 character from input

if 'A' then 6
if 'B' then 8
if '#' then 10

// if it's not A or B, we keep trying
goto 1

write 'A'
goto 1

write 'B'
goto 1

end
```

## Installation

You can always use the version of the app that's on my website. If you prefer to run it yourself and to perhaps modify it, you can try the steps below.

This project was originally generated with the `create-react-app` script. For more details, read that script's description [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md) and the "Typescript React Starter" guide [here](https://github.com/Microsoft/TypeScript-React-Starter#typescript-react-starter).

1. Clone the repository (or your fork of it) to your device.
2. `npm install`
3. `npm run start`

### Deployment

1. Clone the repository (or your fork of it) to your server.
2. Edit the `homepage` attribute in [`package.json`](package.json).
3. `npm install`
4. `npm run build`
5. Decide on a way to run the app, such as `serve -s ~/ram-simulator/build`. (`npm install serve`)
6. Create and start a daemon that uses above command to keep the app running.
7. Create a rule so that your webserver correctly serves the port the app is running on to the path you want to reach it on. This could be something like `RewriteRule ^ram-simulator(/.*|$) http://localhost:1234$1 [P]` in your document root `.htaccess` file.

## Modification

Commands are defined in [`commands.ts`](src/logic/commands.ts). To add a new command, just create a new class that extends the generic `RamCommand` and give it `execute` and `matchAndConstruct` methods. Then add it to the exported list of commands at the end of the file. The app will automatically construct and run your custom command if one of the program's lines matches it.
