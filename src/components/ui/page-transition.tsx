import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const pageVariants = {
  fadeSlide: {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.97 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.01 },
  },
}

const transition = {
  duration: 0.32,
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
}

interface PageTransitionProps {
  children: React.ReactNode
  /** Use 'scale' for modal-like pages, default is 'fadeSlide' */
  variant?: keyof typeof pageVariants
  className?: string
}

/**
 * PageTransition — wraps page content with AnimatePresence + motion.div.
 * Keyed by pathname so each route change triggers enter/exit animation.
 * Always wrap your page's root element with this.
 */
export function PageTransition({ children, variant = 'fadeSlide', className }: PageTransitionProps) {
  const location = useLocation()
  const v = pageVariants[variant]

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={v.initial}
        animate={v.animate}
        exit={v.exit}
        transition={transition}
        className={className}
        style={{ willChange: 'opacity, transform' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

/**
 * useStaggerReveal — hook to create stagger variants for children.
 * Usage:
 *   const { container, item } = useStaggerReveal()
 *   <motion.div variants={container} initial="hidden" animate="visible">
 *     <motion.div variants={item}>...</motion.div>
 *   </motion.div>
 */
export function useStaggerReveal(staggerDelay = 0.08, itemY = 18) {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.05,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: itemY },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 120,
        damping: 18,
      },
    },
  }

  return { container, item }
}

/**
 * FadeIn — simple opacity + translateY entrance wrapper.
 * delay prop in seconds.
 */
export function FadeIn({
  children,
  delay = 0,
  y = 16,
  className,
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * ScrollReveal — triggers animation when element enters the viewport.
 */
export function ScrollReveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
