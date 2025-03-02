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

function count(file: fs.PathLike | number): {
  lines: number;
  words: number;
  chars: number;
} {
  const content = fs.readFileSync(file, "utf-8");

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

  // If positionalArgs is empty, read from stdin (0)
  // If positionalArgs has values, use those file paths
  const readFrom = positionalArgs.length > 0 ? positionalArgs : [0];

  let total_lines = 0;
  let total_words = 0;
  let total_chars = 0;
  for (let inputFile of readFrom) {
    const countObj = count(inputFile);
    const result: number[] = [];
    if (options["-l"]) {
      result.push(countObj.lines);
      total_lines += countObj.lines;
    }
    if (options["-w"]) {
      result.push(countObj.words);
      total_words += countObj.words;
    }
    if (options["-c"]) {
      result.push(countObj.chars);
      total_chars += countObj.chars;
    }

    console.log("  " + result.join(" ") + " " + inputFile);
  }
  console.log(
    "  " + total_lines + " " + total_words + " " + total_chars + " " + "total"
  );
} catch (error) {
  console.error(error);
  process.exit(1);
}
