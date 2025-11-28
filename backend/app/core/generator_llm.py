import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
GENAI_API_KEY = os.getenv("GENAI_API_KEY")
if GENAI_API_KEY:
    genai.configure(api_key=GENAI_API_KEY)

async def generate_script(topic: str, duration: str, mood: str) -> dict:
    """
    Generates a video script using Google Gemini.
    """
    if not GENAI_API_KEY:
        raise ValueError("GENAI_API_KEY not found in environment variables")

    model = genai.GenerativeModel('gemini-pro')

    system_prompt = """
    You are an AI Content Factory specialized in creating scripts for YouTube videos.
    Topic: {topic}
    Target Duration: {duration}
    Mood: {mood}

    Output MUST be a valid JSON object with the following structure:
    {{
        "title": "Video Title",
        "scenes": [
            {{
                "id": 1,
                "narration": "Voiceover text for this scene...",
                "visual_prompt": "Description of the visual for this scene..."
            }}
        ]
    }}

    Rules:
    1. The "visual_prompt" should be descriptive but concise, suitable for generating a stickman style image.
    2. The "narration" should be engaging and fit the requested mood.
    3. Ensure the script length matches the target duration approximately.
    4. Return ONLY the JSON object, no markdown formatting or extra text.
    """

    prompt = system_prompt.format(topic=topic, duration=duration, mood=mood)

    try:
        response = model.generate_content(prompt)
        # Clean up potential markdown code blocks
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
        
        return json.loads(text)
    except Exception as e:
        print(f"Error generating script: {e}")
        raise
