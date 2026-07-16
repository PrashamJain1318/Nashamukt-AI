import React from "react"
import { cn } from "@/lib/utils"

/**
 * Skeleton — wave shimmer variant matching dark/light theme.
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-md skeleton-wave", className)}
      aria-busy="true"
      aria-label="Loading…"
      {...props}
    />
  )
}

/**
 * ShimmerSkeleton — animated moving highlight shimmer.
 */
function ShimmerSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-md bg-secondary/50",
        "bg-[linear-gradient(110deg,hsl(var(--secondary))_25%,hsl(var(--secondary)/0.4)_37%,hsl(var(--secondary))_63%)]",
        "bg-[length:400%_100%] animate-shimmer",
        className
      )}
      aria-busy="true"
      aria-label="Loading…"
      {...props}
    />
  )
}

/**
 * SkeletonCard — preset: rounded card with header + body lines
 */
function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border/40 p-5 space-y-4", className)}>
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <Skeleton className="h-3 w-3/5" />
    </div>
  )
}

/**
 * SkeletonRow — inline row with avatar + lines
 */
function SkeletonRow({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Skeleton className="h-9 w-9 rounded-full shrink-0" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}

/**
 * SkeletonAvatar — circle avatar placeholder
 */
function SkeletonAvatar({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <Skeleton
      className={cn("rounded-full shrink-0", className)}
      style={{ width: size, height: size }}
    />
  )
}

/**
 * SkeletonStat — stat card placeholder (number + label)
 */
function SkeletonStat({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border/40 p-5 space-y-3", className)}>
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-2 w-full rounded-full" />
    </div>
  )
}

/**
 * SkeletonGrid — 4 stat cards in a responsive grid
 */
function SkeletonGrid({ cols = 4, className }: { cols?: 2 | 3 | 4; className?: string }) {
  const gridClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }[cols]

  return (
    <div className={cn(`grid ${gridClass} gap-4`, className)}>
      {Array.from({ length: cols }).map((_, i) => (
        <SkeletonStat key={i} />
      ))}
    </div>
  )
}

export { Skeleton, ShimmerSkeleton, SkeletonCard, SkeletonRow, SkeletonAvatar, SkeletonStat, SkeletonGrid }
