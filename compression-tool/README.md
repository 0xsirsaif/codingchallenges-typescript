# compression-tool

- For example, if we have the string "aaabbc", traditional encoding would require 6 bytes (one for each character). However, using Huffman coding, we might assign: 'a': 1, 'b': 01, and 'c': 10, compressing the string to 111010110 (just 9 bits instead of 48 bits)6. This remarkable efficiency is achieved through a systematic approach involving frequency analysis, binary tree construction, and code generation.

## Description

A TypeScript project.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Process

- `curl -L "https://www.dropbox.com/scl/fi/w227qldw9qnpgaw8a8u0k/challenge-huffman.zip?dl=1&e=1&file_subpath=%2Ftest.txt&rlkey=biu7wnugjy9nziev8ejzogsm9&st=jxmfe3fs" -o challenge-huffman.zip` -L flag: Tells curl to follow redirects, which is common with Dropbox links.
- 
