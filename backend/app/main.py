from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os
import asyncio
from typing import Optional

from app.core.generator_llm import generate_script
from app.core.generator_tts import generate_audio
from app.core.generator_img import generate_image
from app.utils.file_manager import create_task_directory, save_script, create_zip_archive, TEMP_STORAGE_DIR

app = FastAPI(title="AntiFlow API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for task status (for prototype)
tasks = {}

class GenerateRequest(BaseModel):
    topic: str
    duration_target: str
    mood: str

async def process_generation(task_id: str, request: GenerateRequest, task_dir: str):
    try:
        tasks[task_id]["status"] = "processing"
        
        # 1. Generate Script
        script_data = await generate_script(request.topic, request.duration_target, request.mood)
        save_script(task_dir, script_data)
        tasks[task_id]["preview_data"] = script_data
        
        # 2. Parallel Generation (Audio & Images)
        audio_tasks = []
        image_tasks = []
        
        # Limit concurrent audio requests to avoid rate limiting (max 3 at a time)
        semaphore = asyncio.Semaphore(3)
        
        # Use default voice only
        DEFAULT_VOICE = "en-US-ChristopherNeural"
        
        async def generate_audio_with_limit(scene, audio_path):
            async with semaphore:
                # Add small delay between requests to avoid rate limiting
                await asyncio.sleep(0.5)
                return await generate_audio(scene['narration'], audio_path, DEFAULT_VOICE)
        
        for scene in script_data.get("scenes", []):
            # Audio
            audio_path = os.path.join(task_dir, f"audio_{scene['id']}.mp3")
            audio_tasks.append(generate_audio_with_limit(scene, audio_path))
            
            # Image generation disabled for all durations as per user request
            # Visual prompts are still generated in the script but no images are created
            pass
        
        # Execute audio generation tasks
        if audio_tasks:
            results = await asyncio.gather(*audio_tasks, return_exceptions=True)
            # Check for any failures
            failed_scenes = []
            for i, result in enumerate(results):
                if isinstance(result, Exception):
                    scene_id = script_data.get("scenes", [])[i].get("id", i+1) if i < len(script_data.get("scenes", [])) else i+1
                    error_msg = f"Audio generation failed for scene {scene_id}: {str(result)}"
                    print(error_msg)
                    failed_scenes.append((scene_id, str(result)))
            
            if failed_scenes:
                error_summary = f"Failed to generate audio for {len(failed_scenes)} scene(s): {', '.join([f'scene {sid}' for sid, _ in failed_scenes])}"
                raise Exception(error_summary)
            
        # Execute image tasks (currently empty)
        if image_tasks:
            await asyncio.gather(*image_tasks, return_exceptions=True)
        
        # 3. Package
        # zip_path = create_zip_archive(task_dir, task_id)
        
        tasks[task_id]["status"] = "completed"
        # tasks[task_id]["download_url"] = f"/api/v1/download/{task_id}"
        tasks[task_id]["file_path"] = task_dir
        
    except Exception as e:
        tasks[task_id]["status"] = "failed"
        tasks[task_id]["error"] = str(e)
        print(f"Task {task_id} failed: {e}")

@app.post("/api/v1/generate")
async def generate(request: GenerateRequest, background_tasks: BackgroundTasks):
    task_id, task_dir = create_task_directory()
    tasks[task_id] = {"status": "pending"}
    
    background_tasks.add_task(process_generation, task_id, request, task_dir)
    
    return {"task_id": task_id, "status": "processing"}

@app.get("/api/v1/result/{task_id}")
async def get_result(task_id: str):
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return tasks[task_id]

@app.get("/api/v1/download/{task_id}")
async def download_result(task_id: str):
    zip_filename = f"{task_id}.zip"
    zip_path = os.path.join(TEMP_STORAGE_DIR, zip_filename)
    
    if not os.path.exists(zip_path):
        raise HTTPException(status_code=404, detail="File not found")
        
    return FileResponse(zip_path, media_type='application/zip', filename=zip_filename)
