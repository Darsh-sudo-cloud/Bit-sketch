# Bitsketch

A small pixel art editor that shows what a drawing looks like to a computer.

Most drawing apps hide the data behind the picture. Bitsketch does the opposite. As you draw, it shows the red, green, blue, and alpha values of each pixel, the raw bytes of the whole canvas, and a SHA-256 fingerprint that changes whenever a single pixel changes.

I built it as a first-year project to practise HTML, CSS, and JavaScript, and to connect some basic cybersecurity ideas to something visual.

## Access it through

https://darsh-sudo-cloud.github.io/Bit-sketch/

## Features

- **16 x 16 canvas** with brush and eraser tools
- **Colour palette** with red, green, blue, and several extra colours
- **Pixel inspector** that shows the position, hex colour, and alpha of the pixel under the mouse
- **Binary view** of each colour channel, so you can see the 8 bits that store each value
- **Byte dump** of all 1,024 bytes (16 x 16 pixels x 4 values), formatted like a hex editor
- **SHA-256 fingerprint** of the whole canvas, recalculated after every stroke

## How to run it

You can use the live demo above, or run it on your own computer:

1. Download or clone the repository:
   ```bash
   git clone https://github.com/Darsh-sudo-cloud/Bit-sketch.git
   ```
2. Open the folder and double-click `index.html`.

The SHA-256 fingerprint uses the browser's Web Crypto API, which some browsers only allow on secure pages. If the fingerprint doesn't appear when you open the file directly, run a local server from the folder instead:

```bash
python -m http.server
```

Then open `http://localhost:8000`.

## Project structure

```
Bit-sketch/
├── index.html   Page layout: canvas, tools, and info panels
├── style.css    Dark theme, gold accents, and layout
└── script.js    Drawing, pixel inspection, byte dump, and hashing
```

## How it works

- **Drawing:** The canvas is a 16 x 16 grid. Each mouse position is converted into a grid cell, and that cell is painted with the selected colour.
- **Reading pixels:** The canvas `getImageData` method returns the colour values of any pixel as numbers from 0 to 255.
- **Showing the data:** Each number is converted to hexadecimal and binary text so it can be displayed in the panels.
- **Fingerprint:** The full pixel data is passed to `crypto.subtle.digest("SHA-256", ...)`, which returns a 64-character hash. The same drawing always gives the same hash, and any change gives a different one.

## What I learned

- How the DOM works: finding elements, changing their content, and creating new ones with JavaScript
- How mouse events (`pointerdown`, `pointermove`, `pointerup`) let you draw by dragging
- How pixel data is stored as bytes, and how hexadecimal and binary represent those bytes
- What a hash is, and why a one-way fingerprint is useful for checking whether data has changed

## Ideas for next steps

- A fill tool that colours a connected area
- A larger canvas size, selectable from a dropdown
- Export to PNG
- Side-by-side comparison of two drawings' hashes

## Credits

Built by [Darsh Vora](https://github.com/Darsh-sudo-cloud).
