import os
import shutil
import uuid
import json

TEMP_STORAGE_DIR = "backend/temp_storage"

def create_task_directory() -> str:
    """
    Creates a unique directory for a new task.
    """
    task_id = str(uuid.uuid4())
    task_dir = os.path.join(TEMP_STORAGE_DIR, task_id)
    os.makedirs(task_dir, exist_ok=True)
    return task_id, task_dir

def save_script(task_dir: str, script_data: dict):
    """
    Saves the script data to a text file.
    """
    file_path = os.path.join(task_dir, "script.txt")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(f"Title: {script_data.get('title', 'Untitled')}\n\n")
        for scene in script_data.get("scenes", []):
            f.write(f"Scene {scene.get('id')}:\n")
            f.write(f"Narration: {scene.get('narration')}\n")
            f.write(f"Visual: {scene.get('visual_prompt')}\n\n")
    return file_path

def create_zip_archive(task_dir: str, task_id: str) -> str:
    """
    Zips the task directory.
    """
    zip_filename = f"{task_id}.zip"
    zip_path = os.path.join(TEMP_STORAGE_DIR, zip_filename)
    
    shutil.make_archive(zip_path.replace('.zip', ''), 'zip', task_dir)
    return zip_path
