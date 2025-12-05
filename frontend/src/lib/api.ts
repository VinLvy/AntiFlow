// lib/api.ts

export interface GenerationRequest {
  topic: string;
  duration_target: string;
  mood: string;
  voice: string;
}

export interface GenerationResponse {
  task_id: string;
  status: 'processing' | 'completed' | 'failed';
}

export interface TaskResult {
  status: 'processing' | 'completed' | 'failed';
  download_url?: string;
  file_path?: string;
  error?: string;
  preview_data?: {
    title: string;
    scenes: Array<{
      id: number;
      narration: string;
      visual_prompt: string;
      chapter?: string;
    }>;
  };
}

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

export async function generateContent(data: GenerationRequest): Promise<GenerationResponse> {
  const response = await fetch(`${API_BASE_URL}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to start generation');
  }

  return response.json();
}

export async function checkStatus(taskId: string): Promise<TaskResult> {
  const response = await fetch(`${API_BASE_URL}/result/${taskId}`);

  if (!response.ok) {
    throw new Error('Failed to check status');
  }

  return response.json();
}
