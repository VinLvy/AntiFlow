// lib/api.ts

export interface GenerationRequest {
  topic: string;
  duration_target: string;
  mood: string;
}

export interface GenerationResponse {
  task_id: string;
  status: 'processing' | 'completed' | 'failed';
}

export interface TaskResult {
  status: 'processing' | 'completed' | 'failed';
  download_url?: string;
  preview_data?: {
    title: string;
    scenes: Array<{
      id: number;
      narration: string;
      visual_prompt: string;
    }>;
  };
}

const API_BASE_URL = 'http://localhost:8000/api/v1';

export async function generateContent(data: GenerationRequest): Promise<GenerationResponse> {
  // Mock implementation for now
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        task_id: Math.random().toString(36).substring(7),
        status: 'processing',
      });
    }, 1000);
  });
  
  /* Real implementation:
  const response = await fetch(`${API_BASE_URL}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
  */
}

export async function checkStatus(taskId: string): Promise<TaskResult> {
  // Mock implementation for now
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate random completion
      const isComplete = Math.random() > 0.7;
      resolve({
        status: isComplete ? 'completed' : 'processing',
        download_url: isComplete ? 'http://example.com/download.zip' : undefined,
        preview_data: isComplete ? {
          title: "How to Stop Procrastinating",
          scenes: [
            { id: 1, narration: "Do you often find yourself putting things off?", visual_prompt: "A stickman looking at a clock, stressed" },
            { id: 2, narration: "It's time to take control of your time.", visual_prompt: "Stickman breaking a clock" }
          ]
        } : undefined
      });
    }, 500);
  });

  /* Real implementation:
  const response = await fetch(`${API_BASE_URL}/result/${taskId}`);
  return response.json();
  */
}
