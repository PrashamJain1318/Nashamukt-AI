import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AudioWaveformProps {
  isActive?: boolean
  mode?: 'idle' | 'listening' | 'speaking' | 'thinking'
  className?: string
}

export function AudioWaveform({
  isActive = false,
  mode = 'idle',
  className,
}: AudioWaveformProps) {
  const [bars, setBars] = useState<number[]>([])
  const barCount = 32

  useEffect(() => {
    setBars(Array.from({ length: barCount }, (_, i) => i))
  }, [])

  // Primary active frequency heights
  const getPrimaryHeights = (index: number) => {
    if (!isActive && mode === 'idle') {
      return [4, 6, 4]
    }
    
    // Multipliers for different active states
    const multiplier = mode === 'listening' ? 42 : mode === 'speaking' ? 32 : mode === 'thinking' ? 16 : 6
    const offset = index * 0.4
    
    return [
      4 + Math.abs(Math.sin(offset)) * multiplier,
      6 + Math.abs(Math.cos(offset * 0.7)) * multiplier * 1.25,
      5 + Math.abs(Math.sin(offset + 1.5)) * multiplier * 0.85,
      4 + Math.abs(Math.sin(offset)) * multiplier
    ]
  }

  // Secondary "ghost" harmonic frequency heights (adds depth to the visualizer)
  const getSecondaryHeights = (index: number) => {
    if (!isActive && mode === 'idle') {
      return [2, 3, 2]
    }
    
    const multiplier = mode === 'listening' ? 24 : mode === 'speaking' ? 18 : mode === 'thinking' ? 10 : 4
    const offset = index * 0.6 + Math.PI // Out of phase
    
    return [
      2 + Math.abs(Math.sin(offset)) * multiplier,
      4 + Math.abs(Math.cos(offset * 0.9)) * multiplier * 1.1,
      3 + Math.abs(Math.sin(offset + 0.8)) * multiplier * 0.7,
      2 + Math.abs(Math.sin(offset)) * multiplier
    ]
  }

  // Color maps matching Jarvis states
  const getColors = () => {
    switch (mode) {
      case 'listening':
        return {
          primary: 'bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.6)]',
          secondary: 'bg-orange-600/30 shadow-[0_0_6px_rgba(249,115,22,0.2)]',
          border: 'border-orange-500/20',
          text: 'text-orange-400/80',
        }
      case 'speaking':
        return {
          primary: 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]',
          secondary: 'bg-emerald-600/30 shadow-[0_0_6px_rgba(16,185,129,0.2)]',
          border: 'border-emerald-500/20',
          text: 'text-emerald-400/80',
        }
      case 'thinking':
        return {
          primary: 'bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.6)]',
          secondary: 'bg-purple-600/30 shadow-[0_0_6px_rgba(168,85,247,0.2)]',
          border: 'border-purple-500/20',
          text: 'text-purple-400/80',
        }
      default:
        return {
          primary: 'bg-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]',
          secondary: 'bg-cyan-600/10 shadow-none',
          border: 'border-cyan-500/10',
          text: 'text-cyan-400/60',
        }
    }
  }

  const activeColors = getColors()

  return (
    <div className={cn(
      "relative flex items-center justify-between h-16 px-5 bg-[#020612]/70 backdrop-blur-md rounded-2xl border overflow-hidden shadow-[inset_0_0_15px_rgba(0,0,0,0.6)] transition-colors duration-500",
      activeColors.border,
      className
    )}>
      {/* Sci-fi backdrop grid lines */}
      <div className="absolute inset-0 opacity-10 bg-oscilloscope-grid pointer-events-none" />
      
      {/* Telemetry info (Left) */}
      <div className={cn("hidden md:flex flex-col justify-center font-mono text-[9px] tracking-widest shrink-0 transition-colors duration-500", activeColors.text)}>
        <span>SCOPE: 250MHz</span>
        <span>SIG LEVEL: -42dB</span>
      </div>

      {/* Dynamic Waveform Columns */}
      <div className="flex-1 flex items-center justify-center gap-1 h-full px-4 relative">
        {bars.map((_, i) => (
          <div key={i} className="relative w-1.5 h-[50px] flex items-center justify-center">
            {/* Secondary Background Ghost Wave */}
            <motion.div
              className={cn("w-1 rounded-full absolute transition-colors duration-500", activeColors.secondary)}
              animate={{
                height: getSecondaryHeights(i),
              }}
              transition={{
                duration: mode === 'listening' ? 0.35 : mode === 'speaking' ? 0.45 : 0.75,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
                delay: i * 0.015,
              }}
              style={{ height: '4px' }}
            />
            {/* Primary Main Active Wave */}
            <motion.div
              className={cn("w-1.5 rounded-full absolute z-10 transition-colors duration-500", activeColors.primary)}
              animate={{
                height: getPrimaryHeights(i),
              }}
              transition={{
                duration: mode === 'listening' ? 0.4 : mode === 'speaking' ? 0.5 : 0.8,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
                delay: i * 0.02,
              }}
              style={{ height: '6px' }}
            />
          </div>
        ))}
      </div>

      {/* Telemetry info (Right) */}
      <div className={cn("hidden md:flex flex-col justify-center font-mono text-[9px] tracking-widest text-right shrink-0 transition-colors duration-500", activeColors.text)}>
        <span>AMP: AUTO</span>
        <span className="uppercase">UPLINK: {mode === 'idle' ? 'STANDBY' : mode}</span>
      </div>
    </div>
  )
}
