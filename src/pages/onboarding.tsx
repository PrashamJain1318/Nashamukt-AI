import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Glass } from '@/components/ui/glass'
import { toast } from 'sonner'
import { Brain, Heart, Target, ChevronRight, ChevronLeft, Calendar } from 'lucide-react'
import { apiClient } from '@/lib/api-client'

const onboardingSchema = z.object({
  name: z.string().min(2, "Name is required"),
  age: z.string().min(1, "Age is required"),
  gender: z.string().optional(),
  preferredLanguage: z.string().min(1, "Preferred language is required"),
  
  productsUsed: z.string().min(1, "Please select at least one product"),
  yearsOfAddiction: z.string().min(1, "Required"),
  dailyQuantity: z.string().min(1, "Required"),
  dailySpending: z.string().min(1, "Required"),
  
  reasonForAddiction: z.string().min(5, "Please share a brief reason"),
  reasonToQuit: z.string().min(5, "Please share your main motivation"),
  targetQuitDate: z.string().min(1, "Required")
})

type OnboardingValues = z.infer<typeof onboardingSchema>

export function OnboardingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const totalSteps = 3

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      gender: '',
    }
  })

  const nextStep = async () => {
    let fieldsToValidate: (keyof OnboardingValues)[] = []
    
    if (step === 1) fieldsToValidate = ['name', 'age', 'preferredLanguage']
    if (step === 2) fieldsToValidate = ['productsUsed', 'yearsOfAddiction', 'dailyQuantity', 'dailySpending']
    
    const isStepValid = await trigger(fieldsToValidate)
    if (isStepValid) setStep(s => Math.min(s + 1, totalSteps))
  }

  const prevStep = () => setStep(s => Math.max(s - 1, 1))

  const onSubmit = async (data: OnboardingValues) => {
    try {
      await apiClient.post('/user/onboarding', data)
      toast.success("Profile customized successfully!")
      navigate('/dashboard')
    } catch (err) {
      toast.error("Failed to save profile. Please try again.")
      console.error(err)
    }
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-primary/10 blur-[100px] rounded-full -z-10" />
      
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm font-medium text-muted-foreground mb-2">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>

        <Glass variant="card" className="p-8 md:p-10 relative overflow-hidden rounded-3xl">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait" custom={step}>
              {step === 1 && (
                <motion.div
                  key="step1"
                  custom={1}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Brain className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-display font-bold">Let's Get to Know You</h2>
                    <p className="text-muted-foreground mt-2">Basic information to personalize your AI coach.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Name</label>
                      <Input placeholder="Your preferred name" {...register('name')} />
                      {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Age</label>
                      <Input type="number" placeholder="e.g. 28" {...register('age')} />
                      {errors.age && <p className="text-xs text-destructive">{errors.age.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Gender (Optional)</label>
                      <Input placeholder="e.g. Male, Female, Other" {...register('gender')} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Preferred Language</label>
                      <Input placeholder="e.g. English, Hindi" {...register('preferredLanguage')} />
                      {errors.preferredLanguage && <p className="text-xs text-destructive">{errors.preferredLanguage.message}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  custom={1}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <div className="h-16 w-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="h-8 w-8 text-destructive" />
                    </div>
                    <h2 className="text-3xl font-display font-bold">Your Habit Profile</h2>
                    <p className="text-muted-foreground mt-2">This helps us calculate your health recovery and money saved.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Product(s) Used</label>
                      <Input placeholder="e.g. Cigarettes, Alcohol, Gutkha" {...register('productsUsed')} />
                      {errors.productsUsed && <p className="text-xs text-destructive">{errors.productsUsed.message}</p>}
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Years Active</label>
                        <Input type="number" placeholder="Years" {...register('yearsOfAddiction')} />
                        {errors.yearsOfAddiction && <p className="text-xs text-destructive">{errors.yearsOfAddiction.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Daily Quantity</label>
                        <Input type="number" placeholder="Amount" {...register('dailyQuantity')} />
                        {errors.dailyQuantity && <p className="text-xs text-destructive">{errors.dailyQuantity.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Daily Cost (₹)</label>
                        <Input type="number" placeholder="Cost" {...register('dailySpending')} />
                        {errors.dailySpending && <p className="text-xs text-destructive">{errors.dailySpending.message}</p>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  custom={1}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <div className="h-16 w-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="h-8 w-8 text-success" />
                    </div>
                    <h2 className="text-3xl font-display font-bold">Your Motivation</h2>
                    <p className="text-muted-foreground mt-2">Set your intentions. Why are you choosing freedom?</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Main reason it started?</label>
                      <Input placeholder="e.g. Peer pressure, Stress from work" {...register('reasonForAddiction')} />
                      {errors.reasonForAddiction && <p className="text-xs text-destructive">{errors.reasonForAddiction.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Main reason to quit now?</label>
                      <Input placeholder="e.g. For my family, Health concerns" {...register('reasonToQuit')} />
                      {errors.reasonToQuit && <p className="text-xs text-destructive">{errors.reasonToQuit.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Target Quit Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="date" className="pl-10" {...register('targetQuitDate')} />
                      </div>
                      {errors.targetQuitDate && <p className="text-xs text-destructive">{errors.targetQuitDate.message}</p>}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between mt-10 pt-6 border-t border-border/50">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={prevStep}
                className={step === 1 ? "invisible" : ""}
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              
              {step < totalSteps ? (
                <Button type="button" onClick={nextStep} className="px-8 rounded-full shadow-lg shadow-primary/20">
                  Continue <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting} className="px-8 rounded-full shadow-lg shadow-primary/20">
                  {isSubmitting ? "Saving..." : "Start Journey"} 
                  {!isSubmitting && <Sparkles className="ml-2 h-4 w-4" />}
                </Button>
              )}
            </div>
          </form>
        </Glass>
      </div>
    </div>
  )
}

function Sparkles(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  )
}
