#!/usr/bin/env node

interface OptionsDict {
  [option: string]: string | boolean;
}

let options: OptionsDict = {};
let positionalArgs: string[] = [];

function parseArgs() {
  let args = process.argv;
  for (let i = 2; i < args.length; i++) {
    let token: string = args[i];
    if (token.startsWith("-")) {
      if (token.includes("=")) {
        // Options: --c=value
        let [option, value] = token.split("=");
        options[option] = value;
      } else {
        // Flags: --c
        options[token] = true;
      }
    } else {
      // Positional Arguments: test.txt
      positionalArgs.push(token);
    }
  }
}

function validateArgs() {
  // Check Mutually Exclusive Group: -c, -l, -w
  let mutuallyExclusiveOptions = new Set(["-c", "-l", "-w"]);
  let optionCount = 0;
  for (const key of Object.keys(options)) {
    if (mutuallyExclusiveOptions.has(key)) {
      optionCount++;
    }
  }
  if (optionCount > 1) {
    throw new Error(
      "Options -c, -l, and -w are mutually exclusive. Please use only one."
    );
  }

  // Check if no file passed.
  // TODO: Read from STD input
  if (positionalArgs.length === 0) {
    throw new Error("No input file provided");
  }
}

function main() {}

try {
  parseArgs();

  validateArgs();

  // default option '-lwc'
  if (Object.keys(options).length === 0) {
    options["-l"] = true;
    options["-w"] = true;
    options["-c"] = true;
  }

  main();

  console.log(options);
  console.log(positionalArgs);
} catch (error) {
  console.error(error);
  process.exit(1);
}
