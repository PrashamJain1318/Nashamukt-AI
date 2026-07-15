import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AuthLayout } from '@/components/ui/auth-layout'
import { MailCheck } from 'lucide-react'
import { toast } from 'sonner'

export function VerifyEmailPage() {
  
  const handleResend = () => {
    toast.success("Verification email resent!")
  }

  return (
    <AuthLayout 
      title="Check your email" 
      subtitle="We've sent a verification link to your email address."
    >
      <div className="flex flex-col items-center justify-center space-y-6 py-4">
        <div className="h-24 w-24 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
          <MailCheck className="h-12 w-12 text-primary" />
        </div>
        
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Please click the link in the email to verify your account and continue.
          </p>
          <p className="text-xs text-muted-foreground">
            Didn't receive the email? <button onClick={handleResend} className="text-primary hover:underline">Click to resend</button>
          </p>
        </div>

        <Link to="/onboarding" className="w-full mt-4">
          <Button className="w-full" variant="secondary">Continue to Onboarding</Button>
        </Link>
      </div>
    </AuthLayout>
  )
}
