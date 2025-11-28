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
        
        for scene in script_data.get("scenes", []):
            # Audio
            audio_path = os.path.join(task_dir, f"audio_{scene['id']}.mp3")
            audio_tasks.append(generate_audio(scene['narration'], audio_path))
            
            # Image
            image_path = os.path.join(task_dir, f"image_{scene['id']}.jpg")
            image_tasks.append(generate_image(scene['visual_prompt'], image_path))
            
        await asyncio.gather(*audio_tasks, *image_tasks)
        
        # 3. Package
        zip_path = create_zip_archive(task_dir, task_id)
        
        tasks[task_id]["status"] = "completed"
        tasks[task_id]["download_url"] = f"/api/v1/download/{task_id}"
        
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
