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

    # Estimate word count based on duration
    # Average speaking rate is ~150 words per minute
    target_word_count = "150-200 words" # Default Short
    target_scene_count = "3-5 scenes"
    
    if "medium" in duration.lower():
        target_word_count = "600-900 words"
        target_scene_count = "10-15 scenes"
    elif "long" in duration.lower():
        target_word_count = "1200+ words"
        target_scene_count = "20-30 scenes"

    system_prompt = """
    You are an AI Content Factory specialized in creating scripts for YouTube videos.
    Topic: {topic}
    Target Duration: {duration}
    Target Word Count: {word_count}
    Target Scene Count: {scene_count}
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
    1. The "visual_prompt" should be descriptive but concise, suitable for generating a modern minimalist style image.
    2. The "narration" should be engaging and fit the requested mood.
    3. CRITICAL: Ensure the TOTAL word count of all narrations combined is approximately {word_count} to match the target duration.
    4. CRITICAL: Generate approximately {scene_count} to ensure good pacing.
    5. Return ONLY the JSON object, no markdown formatting or extra text.
    """

    prompt = system_prompt.format(topic=topic, duration=duration, word_count=target_word_count, scene_count=target_scene_count, mood=mood)

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
