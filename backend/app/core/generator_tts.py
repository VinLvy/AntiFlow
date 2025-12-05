import edge_tts
import os

async def generate_audio(text: str, output_path: str, voice: str = "en-US-AndrewNeural") -> str:
    """
    Generates audio from text using edge-tts.
    """
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(output_path)
    return output_path
