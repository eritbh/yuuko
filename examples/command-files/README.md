# Commands in multiple files

This example demonstrates how to automatically register every file in a folder as a command. When you run `index.js`, Yuuko's `addCommandDir` function looks through the `commands` folder and tries to load a command from the default export of every Javascript file in the folder.
