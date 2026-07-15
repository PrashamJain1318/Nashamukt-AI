import { useState, useRef, KeyboardEvent, ClipboardEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AuthLayout } from '@/components/ui/auth-layout'
import { toast } from 'sonner'
import { ShieldCheck, ArrowLeft } from 'lucide-react'

export function VerifyOTPPage() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const navigate = useNavigate()

  const focusNext = (index: number) => {
    if (index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const focusPrev = (index: number) => {
    if (index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value
    if (isNaN(Number(value))) return

    const newOtp = [...otp]
    // Only take the last character in case they paste/type fast
    newOtp[index] = value.substring(value.length - 1)
    setOtp(newOtp)

    if (value !== '') focusNext(index)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '') {
        focusPrev(index)
      } else {
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
      }
    } else if (e.key === 'ArrowLeft') {
      focusPrev(index)
    } else if (e.key === 'ArrowRight') {
      focusNext(index)
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...otp]
    for (let i = 0; i < pastedData.length; i++) {
      if (i < 6) newOtp[i] = pastedData[i]
    }
    setOtp(newOtp)
    
    // Focus the next empty input or the last one
    const nextIndex = Math.min(pastedData.length, 5)
    inputRefs.current[nextIndex]?.focus()
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const otpValue = otp.join('')
    if (otpValue.length !== 6) {
      toast.error('Please enter a 6-digit code')
      return
    }

    setIsSubmitting(true)
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    toast.success('OTP Verified successfully!')
    navigate('/login')
  }

  const handleResend = () => {
    toast.success("New OTP sent to your device!")
  }

  return (
    <AuthLayout 
      title="Two-Factor Authentication" 
      subtitle="Enter the 6-digit code sent to your device"
    >
      <div className="flex justify-center mb-8 mt-2">
        <div className="bg-primary/20 p-4 rounded-full">
          <ShieldCheck className="h-8 w-8 text-primary" />
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        <div className="flex justify-between gap-2 sm:gap-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-lg border border-input bg-background focus:border-primary focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          ))}
        </div>
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
             <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
          ) : 'Verify Code'}
        </Button>
      </form>

      <div className="flex flex-col items-center mt-6 space-y-4">
        <p className="text-center text-sm text-muted-foreground">
          Didn't receive the code? <button onClick={handleResend} className="text-primary hover:underline">Resend</button>
        </p>

        <Link to="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </Link>
      </div>
    </AuthLayout>
  )
}
