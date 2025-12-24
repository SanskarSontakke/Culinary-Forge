# Culinary Forge

**Culinary Forge** is a "Virtual Food Photographer" application that transforms text-based menus into professional-looking food photography using the power of AI.

## Features

- **Menu Analysis**: Paste your text-based menu, and the app uses Gemini AI to automatically extract dish names and descriptions.
- **AI Image Generation**: Generate high-quality images for each extracted dish.
- **Style Customization**: Choose from different photography styles (Rustic/Dark, Bright/Modern, Social Media) and add custom prompts to fine-tune the results.
- **AI Editing**: Edit generated images using AI-powered tools.
- **Download**: Easily download your generated food photos.

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI Integration**: Google Gemini API (`@google/genai`)

## View in AI Studio

View your app in AI Studio: https://ai.studio/apps/drive/11ZpJCqdQ9VSG6aUmX1o7XRbrqpoAMFda

## Getting Started

### Prerequisites

- Node.js installed on your machine.
- A Google Gemini API key.

### Installation

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Environment Setup:**

    Create a `.env.local` file in the root directory and add your Gemini API key:

    ```env
    GEMINI_API_KEY=your_api_key_here
    ```

3.  **Run the application:**

    ```bash
    npm run dev
    ```

    Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`).

## Usage

1.  **Paste Menu**: Enter your menu text into the text area.
2.  **Analyze**: Click "Analyze Menu" to extract dishes.
3.  **Generate**: Click "Generate Photo" for individual dishes.
4.  **Customize**: Use the style selector to change the look of the photos.
5.  **Edit/Download**: Click on a generated image to access editing options or download it.
