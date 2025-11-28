"use client";

import { motion } from 'framer-motion';
import GeneratorForm from './components/GeneratorForm';
import { Zap, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden selection:bg-indigo-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 space-y-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-4 hover:bg-white/10 transition-colors cursor-default"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-sm font-medium text-indigo-300">AI Content Factory v1.0</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
            Create Viral <br />
            <span className="text-gradient relative">
              Stickman Videos
              <Sparkles className="absolute -top-6 -right-8 w-8 h-8 text-yellow-400 animate-bounce" />
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Generate complete raw asset kits for your YouTube channel in seconds.
            Script, voiceover, and visuals—all powered by AI.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="transition-all duration-500 ease-in-out"
        >
          <GeneratorForm />
        </motion.div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-24 text-center text-gray-600 text-sm"
        >
          <p className="flex items-center justify-center gap-2">
            Powered by <Zap className="w-4 h-4 text-yellow-500" /> AntiFlow Engine
          </p>
        </motion.footer>
      </div>
    </main>
  );
}
