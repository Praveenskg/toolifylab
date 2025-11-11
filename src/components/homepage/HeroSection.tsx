'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useMemo } from 'react';

export function HeroSection() {
  // Generate stable random values for particles
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 5,
        left: Math.random() * 100,
        top: Math.random() * 100,
      })),
    [],
  );

  return (
    <section className='from-background via-primary/5 to-background relative w-full overflow-hidden bg-linear-to-br py-16 sm:py-24 lg:py-32'>
      {/* Advanced animated background elements */}
      <div className='absolute inset-0 overflow-hidden'>
        {/* Base gradient overlay */}
        <div className='absolute inset-0 bg-linear-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10' />

        {/* Floating particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className='bg-primary/30 absolute h-1 w-1 rounded-full'
            animate={{
              x: [0, particle.x],
              y: [0, particle.y],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'easeInOut',
            }}
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
          />
        ))}

        {/* Main gradient orbs with enhanced animations */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className='absolute -top-40 -right-40 h-80 w-80 rounded-full bg-linear-to-br from-indigo-500/20 to-purple-500/20 blur-3xl'
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className='absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-linear-to-br from-purple-500/15 to-pink-500/15 blur-3xl'
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [180, 360, 180],
            x: [0, 15, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className='absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-br from-pink-500/10 to-indigo-500/10 blur-3xl'
        />

        {/* Additional floating elements */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
          className='absolute top-1/4 right-1/4 h-32 w-32 rounded-full bg-linear-to-br from-blue-400/20 to-cyan-400/20 blur-2xl'
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1.1, 1, 1.1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'linear',
          }}
          className='absolute bottom-1/4 left-1/4 h-24 w-24 rounded-full bg-linear-to-br from-emerald-400/20 to-teal-400/20 blur-2xl'
        />
      </div>

      <div className='relative z-10 container mx-auto px-4 text-center sm:px-6 lg:px-8'>
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.6, ease: 'easeOut' }}
          whileHover={{ scale: 1.05, y: -2 }}
          className='text-primary border-primary/20 mb-6 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border bg-linear-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 px-4 py-2 text-sm font-medium shadow-lg backdrop-blur-sm'
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            whileHover={{ scale: 1.2 }}
          >
            🔬
          </motion.div>
          <motion.span
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            18+ Tools. One Professional Lab.
          </motion.span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
          className='from-foreground via-foreground to-foreground bg-linear-to-r bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl'
        >
          <motion.span
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Your Professional{' '}
          </motion.span>
          <motion.span
            className='bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent'
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              scale: [1, 1.02, 1],
            }}
            transition={{
              opacity: { delay: 0.6, duration: 0.6 },
              y: { delay: 0.6, duration: 0.6 },
              backgroundPosition: { duration: 5, repeat: Infinity, ease: 'linear' },
              scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
            }}
            style={{ backgroundSize: '200% 200%' }}
          >
            Tool Laboratory
          </motion.span>
          <motion.span
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {' '}
            for Everything
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
          className='text-muted-foreground mx-auto mt-6 max-w-2xl text-lg leading-relaxed sm:text-xl md:text-2xl'
        >
          From finance to health, productivity to planning—ToolifyLab gives you everything you need
          in one fast, privacy-first laboratory.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6, ease: 'easeOut' }}
          className='mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6'
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <Link href='#tools'>
              <button className='hover:shadow-primary/25 group relative overflow-hidden rounded-xl bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 hover:shadow-xl'>
                <motion.div
                  className='absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0'
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
                <span className='relative z-10'>Explore Lab</span>
                <motion.span
                  className='relative z-10 ml-2 inline-block'
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  →
                </motion.span>
              </button>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <Link href='/bmi-calculator'>
              <button className='border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40 group relative overflow-hidden rounded-xl border px-6 py-4 text-lg font-medium transition-all duration-300'>
                <motion.div
                  className='from-primary/0 via-primary/10 to-primary/0 absolute inset-0 bg-linear-to-r'
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
                <span className='relative z-10'>Try BMI Calculator</span>
              </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Enhanced Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6, ease: 'easeOut' }}
          className='mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4 lg:gap-12'
        >
          {[
            { number: '18+', label: 'Tools', icon: '🔧' },
            { number: '100%', label: 'Free', icon: '💯' },
            { number: 'PWA', label: 'Ready', icon: '📱' },
            { number: '24/7', label: 'Available', icon: '⏰' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 1.4 + index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className='group cursor-pointer text-center'
            >
              <motion.div
                className='mb-2 text-4xl'
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                whileHover={{ scale: 1.2 }}
              >
                {stat.icon}
              </motion.div>
              <motion.div
                className='text-primary text-2xl font-bold sm:text-3xl md:text-4xl'
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
              >
                {stat.number}
              </motion.div>
              <motion.div
                className='text-muted-foreground mt-1 text-sm sm:text-base'
                whileHover={{ color: 'hsl(var(--primary))' }}
              >
                {stat.label}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
