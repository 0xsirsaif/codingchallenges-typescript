#!/usr/bin/env node

import * as fs from "fs";

const OPTION_MAP = {
  "--lines": "-l",
  "--words": "-w",
  "--bytes": "-c",
} as const;

type LongFormOptions = keyof typeof OPTION_MAP;
type ShortFormOptions = (typeof OPTION_MAP)[LongFormOptions];
type Flags = {
  [K in ShortFormOptions]?: boolean;
};

const validShortOptions = new Set(Object.values(OPTION_MAP));

let options: Flags = {};
let positionalArgs: string[] = [];

function parseArgs() {
  let args = process.argv;
  for (let i = 2; i < args.length; i++) {
    let token: string = args[i];

    // Long-Form Options.
    if (token.startsWith("--")) {
      if (!(token in OPTION_MAP)) {
        throw new Error(`Invalid option: ${token}`);
      }
      const shortForm = OPTION_MAP[token as LongFormOptions];
      options[shortForm] = true;
      // Short-Form Options.
    } else if (token.startsWith("-")) {
      const compinedArgs: string[] = token.slice(1).split("");
      for (const flag of compinedArgs) {
        let shortForm = `-${flag}`;
        if (!validShortOptions.has(shortForm as ShortFormOptions)) {
          throw new Error(`Invalid option: -${flag}`);
        }
        options[shortForm as ShortFormOptions] = true;
      }
      // Positional Arguments
    } else {
      positionalArgs.push(token);
    }
  }
}

function count(): { lines: number; words: number; chars: number } {
  const readFrom = positionalArgs[0] ? positionalArgs[0] : 0;
  const content = fs.readFileSync(readFrom, "utf-8");

  let lines = 0;
  let words = 0;
  let chars = 0;
  let inWord: boolean = false;

  for (let char of content) {
    chars++;

    if (char === " " || char === "\t") {
      if (inWord) {
        words++;
        inWord = false;
      }
    } else if (char === "\n") {
      lines++;
      if (inWord) {
        words++;
        inWord = false;
      }
    } else {
      inWord = true;
    }
  }
  if (inWord) {
    words++;
  }
  return {
    lines: lines,
    words: words,
    chars: chars,
  };
}

try {
  parseArgs();

  // default option '-lwc'
  if (Object.keys(options).length === 0) {
    options["-l"] = true;
    options["-w"] = true;
    options["-c"] = true;
  }

  const countObj = count();
  const result: number[] = [];
  if (options["-l"]) {
    result.push(countObj.lines);
  }
  if (options["-w"]) {
    result.push(countObj.words);
  }
  if (options["-c"]) {
    result.push(countObj.chars);
  }

  console.log(result.join(" ") + (positionalArgs[0] ? ` ${positionalArgs[0]}` : ''))
} catch (error) {
  console.error(error);
  process.exit(1);
}
