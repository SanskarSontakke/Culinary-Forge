# Culinary Forge
> Paste a text-based menu and generate images of each dish using AI.

## What it does

Takes menu text, extracts dish names and descriptions using Gemini AI, and generates an image for each dish. You can pick from preset photography styles (Rustic/Dark, Bright/Modern, Social Media) or add custom details. Generated images can be edited with AI tools or downloaded as PNG.

## Why I built it

Learning project to practice React/TypeScript, work with the Gemini API, and explore AI image generation workflows.

## Tech stack

- React, TypeScript
- Vite
- Tailwind CSS, Lucide icons
- Google Gemini API (`@google/genai`)

## Getting started

```bash
git clone https://github.com/SanskarSontakke/Culinary-Forge
cd Culinary-Forge
npm install
```

Create `.env.local` with:
```
API_KEY=your_google_gemini_api_key
```

Then run:
```bash
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## How it works

1. Paste a menu into the text area
2. Click "Analyze Menu" — Gemini 2.5 Flash extracts dish names and descriptions
3. Click "Generate Photo" on a dish — Gemini generates an image based on the style and description
4. Optionally edit the image with AI or download as PNG

## Results / status

Working demo. Text extraction works consistently. Image generation depends on Gemini API quota and content policy.

## License

MIT © 2026 Sanskar Sontakke
