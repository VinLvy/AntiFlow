"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, Download, Loader2, AlertCircle, FileText, Image as ImageIcon, Music, ArrowLeft } from 'lucide-react';
import { checkStatus, TaskResult } from '@/lib/api';

export default function ResultPage() {
    const params = useParams();
    const router = useRouter();
    const taskId = params.taskId as string;
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

        pollStatus();
        intervalId = setInterval(pollStatus, 2000);

        return () => clearInterval(intervalId);
    }, [taskId]);

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="glass-card p-8 rounded-2xl w-full max-w-md text-center">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Something went wrong</h3>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="text-white bg-white/10 hover:bg-white/20 px-6 py-2 rounded-lg transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!result || result.status === 'processing') {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
                {/* Background Gradients */}
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-1000" />
                </div>

                <div className="glass-card p-12 rounded-2xl w-full max-w-md text-center relative z-10">
                    <div className="relative w-24 h-24 mx-auto mb-8">
                        <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
                        <Loader2 className="absolute inset-0 m-auto w-10 h-10 text-indigo-400 animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Generating Assets...</h3>
                    <p className="text-gray-400 text-lg">AI is crafting your script, audio, and visuals.</p>
                    <div className="mt-8 flex justify-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-2"><FileText className="w-4 h-4 animate-bounce delay-100" /> Script</span>
                        <span className="flex items-center gap-2"><Music className="w-4 h-4 animate-bounce delay-200" /> Audio</span>
                        <span className="flex items-center gap-2"><ImageIcon className="w-4 h-4 animate-bounce delay-300" /> Images</span>
                    </div>
                </div>
            </div>
        );
    }

    if (result.status === 'failed') {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="glass-card p-8 rounded-2xl w-full max-w-md text-center">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Generation Failed</h3>
                    <p className="text-gray-400 mb-6">{result.error || 'Unknown error occurred'}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="text-white bg-white/10 hover:bg-white/20 px-6 py-2 rounded-lg transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-4 md:p-8 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Generator
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-8 md:p-12 rounded-3xl"
                >
                    <div className="text-center mb-12">
                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-4">Generation Complete!</h1>
                        <p className="text-xl text-gray-400">Your content kit is ready for download.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        <a
                            href={result.download_url}
                            className="flex items-center justify-center gap-3 bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <Download className="w-6 h-6" />
                            Download Asset Kit (.zip)
                        </a>
                        <button
                            onClick={() => router.push('/')}
                            className="flex items-center justify-center gap-3 bg-white/10 text-white font-semibold py-4 rounded-xl hover:bg-white/20 transition-colors"
                        >
                            Create Another Video
                        </button>
                    </div>

                    {result.preview_data && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-px flex-1 bg-white/10"></div>
                                <span className="text-gray-500 font-medium uppercase tracking-wider text-sm">Preview</span>
                                <div className="h-px flex-1 bg-white/10"></div>
                            </div>

                            <div className="bg-black/40 rounded-2xl p-8 border border-white/5">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <FileText className="w-6 h-6 text-indigo-400" />
                                    {result.preview_data.title}
                                </h2>
                                <div className="space-y-6">
                                    {result.preview_data.scenes.map((scene) => (
                                        <div key={scene.id} className="bg-white/5 p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                            <div className="flex items-center gap-4 mb-4">
                                                <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/20">
                                                    SCENE {scene.id}
                                                </span>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <span className="text-gray-500 font-bold uppercase text-xs block mb-2 tracking-wider">Narration</span>
                                                    <p className="text-gray-200 text-lg leading-relaxed font-medium">
                                                        "{scene.narration}"
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 font-bold uppercase text-xs block mb-2 tracking-wider">Visual Prompt</span>
                                                    <p className="text-gray-400 text-sm italic bg-black/20 p-4 rounded-lg border border-white/5">
                                                        {scene.visual_prompt}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
