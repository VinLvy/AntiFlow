"use client";

import { useEffect, useState } from 'react';
import { CheckCircle2, Download, Loader2, AlertCircle, FileText, Image as ImageIcon, Music } from 'lucide-react';
import { checkStatus, TaskResult } from '@/lib/api';

interface StatusDisplayProps {
    taskId: string;
    onReset: () => void;
}

export default function StatusDisplay({ taskId, onReset }: StatusDisplayProps) {
    const [result, setResult] = useState<TaskResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        const pollStatus = async () => {
            try {
                const data = await checkStatus(taskId);
                setResult(data);

                if (data.status === 'completed' || data.status === 'failed') {
                    clearInterval(intervalId);
                }
            } catch (err) {
                setError('Failed to check status');
                clearInterval(intervalId);
            }
        };

        // Initial check
        pollStatus();

        // Poll every 2 seconds
        intervalId = setInterval(pollStatus, 2000);

        return () => clearInterval(intervalId);
    }, [taskId]);

    if (error) {
        return (
            <div className="glass-card p-8 rounded-2xl w-full max-w-md mx-auto text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Something went wrong</h3>
                <p className="text-gray-400 mb-6">{error}</p>
                <button
                    onClick={onReset}
                    className="text-white bg-white/10 hover:bg-white/20 px-6 py-2 rounded-lg transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!result || result.status === 'processing') {
        return (
            <div className="glass-card p-8 rounded-2xl w-full max-w-md mx-auto text-center">
                <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
                    <Loader2 className="absolute inset-0 m-auto w-8 h-8 text-indigo-400 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Generating Assets...</h3>
                <p className="text-gray-400">AI is crafting your script, audio, and visuals.</p>
            </div>
        );
    }

    if (result.status === 'completed') {
        return (
            <div className="glass-card p-8 rounded-2xl w-full max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Generation Complete!</h3>
                    <p className="text-gray-400">Your content kit is ready for download.</p>
                </div>

                {result.preview_data && (
                    <div className="bg-black/20 rounded-xl p-6 mb-8 border border-white/5">
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-400" />
                            Script Preview: {result.preview_data.title}
                        </h4>
                        <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {result.preview_data.scenes.map((scene) => (
                                <div key={scene.id} className="bg-white/5 p-4 rounded-lg border border-white/5">
                                    <div className="flex items-start gap-4 mb-3">
                                        <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-2 py-1 rounded">
                                            Scene {scene.id}
                                        </span>
                                    </div>
                                    <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                                        <span className="text-gray-500 font-medium uppercase text-xs block mb-1">Narration</span>
                                        {scene.narration}
                                    </p>
                                    <p className="text-gray-400 text-xs italic bg-black/20 p-2 rounded">
                                        <span className="text-gray-500 font-medium uppercase not-italic block mb-1">Visual Prompt</span>
                                        {scene.visual_prompt}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <a
                        href={result.download_url}
                        className="flex items-center justify-center gap-2 bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        <Download className="w-5 h-5" />
                        Download Asset Kit (.zip)
                    </a>
                    <button
                        onClick={onReset}
                        className="flex items-center justify-center gap-2 bg-white/10 text-white font-semibold py-4 rounded-xl hover:bg-white/20 transition-colors"
                    >
                        Create Another
                    </button>
                </div>

                <div className="mt-6 flex justify-center gap-6 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> Script</span>
                    <span className="flex items-center gap-1"><Music className="w-4 h-4" /> Audio</span>
                    <span className="flex items-center gap-1"><ImageIcon className="w-4 h-4" /> Images</span>
                </div>
            </div>
        );
    }

    return null;
}
