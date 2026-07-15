import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton, ShimmerSkeleton } from '@/components/ui/skeleton'
import { Glass } from '@/components/ui/glass'
import { ProgressChart } from '@/components/ui/chart'

const mockChartData = [
  { name: 'Mon', value: 20 },
  { name: 'Tue', value: 35 },
  { name: 'Wed', value: 45 },
  { name: 'Thu', value: 30 },
  { name: 'Fri', value: 60 },
  { name: 'Sat', value: 80 },
  { name: 'Sun', value: 100 },
]

export function DesignSystemPage() {
  return (
    <div className="py-12 space-y-16 animate-in fade-in duration-500">
      <div>
        <h1 className="font-display text-4xl font-bold mb-4">Design System</h1>
        <p className="text-muted-foreground">A showcase of the reusable components for NashaMukt AI.</p>
      </div>

      {/* Typography */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold border-b border-border/50 pb-2">Typography</h2>
        <div className="space-y-4 p-6 rounded-2xl border border-border/50 bg-card/50">
          <h1 className="font-display text-5xl font-extrabold">Display / H1</h1>
          <h2 className="font-display text-4xl font-bold">Heading 2</h2>
          <h3 className="font-display text-3xl font-semibold">Heading 3</h3>
          <p className="text-lg text-foreground">Body Large. The quick brown fox jumps over the lazy dog.</p>
          <p className="text-base text-foreground">Body Base. The quick brown fox jumps over the lazy dog.</p>
          <p className="text-sm text-muted-foreground">Body Small (Muted). The quick brown fox jumps over the lazy dog.</p>
        </div>
      </section>

      {/* Colors */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold border-b border-border/50 pb-2">Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="space-y-2"><div className="h-24 rounded-2xl bg-primary shadow-sm" /><p className="text-sm font-medium">Primary</p></div>
          <div className="space-y-2"><div className="h-24 rounded-2xl bg-secondary shadow-sm border border-border/50" /><p className="text-sm font-medium">Secondary</p></div>
          <div className="space-y-2"><div className="h-24 rounded-2xl bg-success shadow-sm" /><p className="text-sm font-medium">Success</p></div>
          <div className="space-y-2"><div className="h-24 rounded-2xl bg-warning shadow-sm" /><p className="text-sm font-medium">Warning</p></div>
          <div className="space-y-2"><div className="h-24 rounded-2xl bg-destructive shadow-sm" /><p className="text-sm font-medium">Danger</p></div>
        </div>
      </section>

      {/* Buttons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold border-b border-border/50 pb-2">Buttons</h2>
        <div className="flex flex-wrap gap-4 items-center p-6 rounded-2xl border border-border/50 bg-card/50">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="ghost">Ghost</Button>
          <Button size="lg">Large</Button>
          <Button size="sm">Small</Button>
        </div>
      </section>

      {/* Badges */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold border-b border-border/50 pb-2">Badges</h2>
        <div className="flex flex-wrap gap-4 p-6 rounded-2xl border border-border/50 bg-card/50">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="destructive">Danger</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </section>

      {/* Forms */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold border-b border-border/50 pb-2">Forms & Inputs</h2>
        <div className="p-6 rounded-2xl border border-border/50 bg-card/50 max-w-md space-y-4">
          <Input placeholder="Default Input" />
          <Input placeholder="Disabled Input" disabled />
          <div className="space-y-1.5">
             <label className="text-sm font-medium text-foreground">With Label</label>
             <Input placeholder="Focus me..." />
          </div>
        </div>
      </section>

      {/* Progress */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold border-b border-border/50 pb-2">Progress Bars</h2>
        <div className="p-6 rounded-2xl border border-border/50 bg-card/50 space-y-8">
          <div className="space-y-2"><p className="text-sm font-medium text-muted-foreground">Primary (45%)</p><Progress value={45} indicatorColor="bg-primary" /></div>
          <div className="space-y-2"><p className="text-sm font-medium text-muted-foreground">Success (80%)</p><Progress value={80} indicatorColor="bg-success" /></div>
          <div className="space-y-2"><p className="text-sm font-medium text-muted-foreground">Warning (30%)</p><Progress value={30} indicatorColor="bg-warning" /></div>
          <div className="space-y-2"><p className="text-sm font-medium text-muted-foreground">Danger (90%)</p><Progress value={90} indicatorColor="bg-destructive" /></div>
        </div>
      </section>

      {/* Skeletons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold border-b border-border/50 pb-2">Loading Skeletons</h2>
        <div className="p-6 rounded-2xl border border-border/50 bg-card/50 grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Standard Pulse</h3>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Premium Shimmer Effect</h3>
            <div className="flex items-center space-x-4">
              <ShimmerSkeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <ShimmerSkeleton className="h-4 w-[200px]" />
                <ShimmerSkeleton className="h-4 w-[150px]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Glassmorphism */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold border-b border-border/50 pb-2">Glass Components</h2>
        <div className="p-6 rounded-2xl border border-border/50 relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/30 grid md:grid-cols-3 gap-6">
          {/* Background decorations for contrast */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary/30 rounded-full blur-2xl" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-warning/20 rounded-full blur-2xl" />
          
          <Glass variant="light" className="p-6 relative z-10">
            <h3 className="font-bold mb-2">Light Glass</h3>
            <p className="text-sm text-muted-foreground">Subtle backdrop blur for overlays.</p>
          </Glass>
          <Glass variant="card" className="p-6 relative z-10">
            <h3 className="font-bold mb-2">Card Glass</h3>
            <p className="text-sm text-muted-foreground">Standard styling for dashboard cards.</p>
          </Glass>
          <Glass variant="heavy" className="p-6 text-foreground relative z-10">
            <h3 className="font-bold mb-2">Heavy Glass</h3>
            <p className="text-sm text-muted-foreground">Strong blur and shadow for popups.</p>
          </Glass>
        </div>
      </section>

      {/* Charts */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold border-b border-border/50 pb-2">Charts Theme</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Primary Metrics</CardTitle></CardHeader>
            <CardContent>
              <ProgressChart data={mockChartData} dataKey="value" color="primary" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Success Trajectory</CardTitle></CardHeader>
            <CardContent>
              <ProgressChart data={mockChartData} dataKey="value" color="success" />
            </CardContent>
          </Card>
        </div>
      </section>

    </div>
  )
}
