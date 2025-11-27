"use client";

import { useState } from 'react';
import GeneratorForm from './components/GeneratorForm';
import StatusDisplay from './components/StatusDisplay';
import { Zap } from 'lucide-react';

export default function Home() {
  const [taskId, setTaskId] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-background relative overflow-hidden selection:bg-indigo-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-24">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-sm font-medium text-indigo-300">AI Content Factory v1.0</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
            Create Viral <br />
            <span className="text-gradient">Stickman Videos</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Generate complete raw asset kits for your YouTube channel in seconds.
            Script, voiceover, and visuals—all powered by AI.
          </p>
        </div>

        <div className="transition-all duration-500 ease-in-out">
          {!taskId ? (
            <GeneratorForm onTaskCreated={setTaskId} />
          ) : (
            <StatusDisplay taskId={taskId} onReset={() => setTaskId(null)} />
          )}
        </div>

        <footer className="mt-24 text-center text-gray-600 text-sm">
          <p className="flex items-center justify-center gap-2">
            Powered by <Zap className="w-4 h-4 text-yellow-500" /> Prototype-6 Engine
          </p>
        </footer>
      </div>
    </main>
  );
}
