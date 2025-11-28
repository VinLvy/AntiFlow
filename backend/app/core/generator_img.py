import aiohttp
import os
import urllib.parse

async def generate_image(prompt: str, output_path: str) -> str:
    """
    Generates an image using Pollinations.ai.
    """
    # Add style modifiers
    base_prompt = "minimalist stickman drawing, thick black ink lines, white background, {}, hand drawn style, sketch, no text"
    final_prompt = base_prompt.format(prompt)
    
    encoded_prompt = urllib.parse.quote(final_prompt)
    url = f"https://pollinations.ai/p/{encoded_prompt}"

    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            if response.status == 200:
                with open(output_path, 'wb') as f:
                    f.write(await response.read())
                return output_path
            else:
                raise Exception(f"Failed to generate image. Status: {response.status}")
