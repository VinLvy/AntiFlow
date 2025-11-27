"use client";

import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { generateContent } from '@/lib/api';

interface GeneratorFormProps {
    onTaskCreated: (taskId: string) => void;
}

export default function GeneratorForm({ onTaskCreated }: GeneratorFormProps) {
    const [topic, setTopic] = useState('');
    const [duration, setDuration] = useState('Short (< 1 min)');
    const [mood, setMood] = useState('Motivational');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await generateContent({ topic, duration_target: duration, mood });
            onTaskCreated(response.task_id);
        } catch (error) {
            console.error("Failed to start generation", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="glass-card p-8 rounded-2xl w-full max-w-md mx-auto">
            <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-6 h-6 text-indigo-400" />
                <h2 className="text-2xl font-bold text-white">Create Content</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Topic
                    </label>
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., How to stop procrastinating"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Duration
                        </label>
                        <select
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all [&>option]:bg-gray-900"
                        >
                            <option>Short (&lt; 1 min)</option>
                            <option>Medium (4-6 min)</option>
                            <option>Long (8+ min)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Mood
                        </label>
                        <select
                            value={mood}
                            onChange={(e) => setMood(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all [&>option]:bg-gray-900"
                        >
                            <option>Motivational</option>
                            <option>Educational</option>
                            <option>Funny</option>
                            <option>Serious</option>
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            Generate Assets
                            <Sparkles className="w-5 h-5" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
