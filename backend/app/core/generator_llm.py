import os
import json
from google import genai
from dotenv import load_dotenv

load_dotenv()

async def generate_script(topic: str, duration: str, mood: str) -> dict:
    """
    Generates a video script using Google Gemini (New SDK).
    """
    api_key = os.getenv("GENAI_API_KEY")
    if not api_key:
        raise ValueError("GENAI_API_KEY not found in environment variables")

    client = genai.Client(api_key=api_key)

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
        response = await client.aio.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        
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
