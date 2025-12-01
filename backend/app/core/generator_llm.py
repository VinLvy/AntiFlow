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
    target_scene_count = "5-10 scenes"
    
    if "medium" in duration.lower():
        target_word_count = "600-900 words"
        target_scene_count = "20-30 scenes"
    elif "long" in duration.lower():
        target_word_count = "1200+ words"
        target_scene_count = "40-60 scenes"

    system_prompt = """
    You are an AI Content Factory specialized in creating scripts for YouTube videos.
    Topic: {topic}
    Target Duration: {duration}
    Target Word Count: {word_count}
    Target Scene Count: {scene_count}
    Mood: {mood}

    Structure the video into logical chapters (e.g., 3 chapters for a typical topic).
    Ensure each sentence in the narration is long, descriptive, and engaging.
    Create a separate scene for EACH sentence to ensure a "visual per sentence" structure.

    Output MUST be a valid JSON object with the following structure:
    {{
        "title": "Video Title",
        "scenes": [
            {{
                "id": 1,
                "chapter": "Chapter Title",
                "narration": "One long, engaging sentence...",
                "visual_prompt": "Detailed visual description matching the sentence..."
            }}
        ]
    }}

    Rules:
    1. Divide the content into logical chapters (e.g., Introduction, Core Concepts, Conclusion, or thematic steps).
    2. "narration": MUST be exactly ONE long, well-crafted sentence per scene.
    3. "visual_prompt": A descriptive visual prompt for that specific sentence.
    4. "chapter": The title of the chapter this scene belongs to.
    5. CRITICAL: Ensure the TOTAL word count is approximately {word_count}.
    6. CRITICAL: The number of scenes will equal the number of sentences. Adjust sentence length to fit the word count and a reasonable number of scenes (approximately {scene_count}).
    7. Return ONLY the JSON object, no markdown formatting or extra text.
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
