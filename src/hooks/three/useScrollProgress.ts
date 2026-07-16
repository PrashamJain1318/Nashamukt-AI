import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { storyScrollProgress } from '@/utils/storyProgress'

/**
 * GSAP ScrollTrigger hook that writes scroll progress (0–1)
 * into a ref — zero React re-renders, 60fps compatible.
 */
export function useScrollProgress(
  containerRef: React.RefObject<HTMLElement | null>,
  onSectionChange?: (index: number, total: number) => void,
  totalSections = 6,
) {
  const progressRef = useRef(0)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.8,          // slightly laggy scrub = cinematic feel
      onUpdate: (self) => {
        progressRef.current = self.progress
        storyScrollProgress.current = self.progress

        if (onSectionChange) {
          const section = Math.min(
            Math.floor(self.progress * totalSections),
            totalSections - 1,
          )
          onSectionChange(section, totalSections)
        }
      },
    })

    return () => trigger.kill()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return progressRef
}
