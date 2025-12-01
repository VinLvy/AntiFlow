# AntiFlow (AI Content Factory)

AntiFlow is an automated tool designed to generate "Raw Asset Kits" for YouTube videos, specifically targeting the Self-growth/Motivation niche with a minimalist modern person visual style. It leverages free AI services to produce scripts, voiceovers, and visuals with $0 operational costs.

## 🚀 Features

-   **Automated Content Generation**: Generates a complete asset kit from a single topic.
-   **AI Scriptwriting**: Uses Google Gemini Pro to create engaging scripts.
-   **Text-to-Speech**: Utilizes `edge-tts` for natural-sounding voiceovers.
-   **Visual Generation**: Generates consistent modern person-style illustrations using Pollinations.ai.
-   **Zero Cost**: Built entirely on free-tier or free-to-use APIs.

## 🛠️ Tech Stack

### Frontend
-   **Framework**: Next.js
-   **Styling**: Tailwind CSS
-   **Language**: TypeScript

### Backend
-   **Framework**: FastAPI (Python)
-   **AI Integration**:
    -   LLM: Google Gemini API (`gemini-2.0-flash`)
    -   TTS: `edge-tts`
    -   Image Gen: Pollinations.ai

## 📂 Project Structure

```
prototype-6/
├── frontend/          # Next.js Frontend
│   ├── src/app/       # App Router pages & components
│   └── public/        # Static assets
├── backend/           # FastAPI Backend
│   ├── app/
│   │   ├── core/      # AI Logic (LLM, TTS, Image)
│   │   ├── utils/     # File management utilities
│   │   └── main.py    # API Entry point
│   ├── temp_storage/  # Generated assets
│   └── requirements.txt
```

## ⚡ Getting Started

### Prerequisites

-   Node.js & npm
-   Python 3.8+
-   Google Gemini API Key

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

3.  Set up environment variables:
    Create a `.env` file in the `backend` directory and add your Gemini API key:
    ```env
    GEMINI_API_KEY=your_api_key_here
    ```

4.  Run the server:
    ```bash
    python -m uvicorn app.main:app --reload
    ```
    The backend will run at `http://localhost:8000`.

### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```
    The frontend will run at `http://localhost:3000`.

## 📖 Usage

1.  Open the frontend in your browser (`http://localhost:3000`).
2.  Enter a video topic (e.g., "How to stop procrastinating").
3.  Click "Generate".
4.  Wait for the process to complete. You will see a preview of the generated assets.
5.  The generated assets will be available in the `temp_storage` directory.

## 📄 License

[MIT](LICENSE)
