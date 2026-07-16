import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/**
 * CustomCursor — spring-physics dot + ring that follows the mouse.
 * Augments the system cursor (cursor: default preserved).
 * Hidden on touch devices via pointer media query.
 * Respects prefers-reduced-motion.
 */
export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false)
  const [isPointer, setIsPointer] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [prefersReduced, setPrefersReduced] = useState(false)

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  // Dot: instant follow
  const dotX = useSpring(cursorX, { stiffness: 1000, damping: 50, mass: 0.1 })
  const dotY = useSpring(cursorY, { stiffness: 1000, damping: 50, mass: 0.1 })

  // Ring: laggy spring follow
  const ringX = useSpring(cursorX, { stiffness: 180, damping: 22, mass: 0.5 })
  const ringY = useSpring(cursorY, { stiffness: 180, damping: 22, mass: 0.5 })

  useEffect(() => {
    // Check reduced motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mq.matches)
    mq.addEventListener('change', (e) => setPrefersReduced(e.matches))

    // Only enable on non-touch
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    if (isTouch) return

    const onMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      setIsVisible(true)

      // Detect if hovering over interactive element
      const target = e.target as Element
      const interactive = target.closest('a, button, input, textarea, select, [role="button"], [tabindex]')
      setIsPointer(!!interactive)
    }

    const onMouseLeave = () => setIsVisible(false)
    const onMouseEnter = () => setIsVisible(true)
    const onMouseDown = () => setIsPressed(true)
    const onMouseUp = () => setIsPressed(false)

    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [cursorX, cursorY])

  if (prefersReduced) return null

  return (
    <>
      {/* Dot — instant */}
      <motion.div
        aria-hidden="true"
        style={{ x: dotX, y: dotY }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isPressed ? 0.6 : isPointer ? 0.5 : 1,
        }}
        transition={{ scale: { duration: 0.15 }, opacity: { duration: 0.2 } }}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        data-testid="cursor-dot"
      >
        <div
          className="rounded-full bg-white"
          style={{
            width: 10,
            height: 10,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </motion.div>

      {/* Ring — lagged */}
      <motion.div
        aria-hidden="true"
        style={{ x: ringX, y: ringY }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isPressed ? 0.8 : isPointer ? 1.5 : 1,
        }}
        transition={{ scale: { duration: 0.25 }, opacity: { duration: 0.25 } }}
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
      >
        <div
          className="rounded-full border border-white/60 mix-blend-difference"
          style={{
            width: 36,
            height: 36,
            transform: 'translate(-50%, -50%)',
            transition: 'border-color 0.2s, width 0.25s, height 0.25s',
            ...(isPointer && {
              borderColor: 'rgba(99, 102, 241, 0.8)',
              width: 48,
              height: 48,
            }),
          }}
        />
      </motion.div>
    </>
  )
}
