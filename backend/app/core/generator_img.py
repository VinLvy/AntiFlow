import aiohttp
import os
import urllib.parse

async def generate_image(prompt: str, output_path: str) -> str:
    """
    Generates an image using Pollinations.ai.
    """
    # Add style modifiers
    base_prompt = "modern minimalist person style, blue, green & soft yellow color palette, {}, no text"
    final_prompt = base_prompt.format(prompt)
    
    encoded_prompt = urllib.parse.quote(final_prompt)
    url = f"https://pollinations.ai/p/{encoded_prompt}"

    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status == 200:
                    with open(output_path, 'wb') as f:
                        f.write(await response.read())
                    return output_path
                else:
                    print(f"Failed to generate image. Status: {response.status}")
                    return None
    except Exception as e:
        print(f"Error generating image: {e}")
        return None
