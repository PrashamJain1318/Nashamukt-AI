import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { QrCode, Share2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export function QRCodeModal() {
  const { user } = useAuth();
  
  if (!user) return null;

  const profileUrl = `${window.location.origin}/p/${user.id}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'NashaMukt AI Progress',
          text: 'Check out my sobriety progress on NashaMukt AI!',
          url: profileUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(profileUrl);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="space-x-2">
          <QrCode className="h-4 w-4" />
          <span>My QR Code</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md flex flex-col items-center p-8">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-display">Public Progress Profile</DialogTitle>
        </DialogHeader>
        
        <div className="bg-white p-4 rounded-xl shadow-inner my-6">
          <QRCodeSVG 
            value={profileUrl} 
            size={200}
            level="H"
            includeMargin={true}
            imageSettings={{
              src: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Check_green_icon.svg",
              x: undefined,
              y: undefined,
              height: 24,
              width: 24,
              excavate: true,
            }}
          />
        </div>

        <p className="text-center text-muted-foreground text-sm mb-6 max-w-xs">
          Scan this QR code to view and share your sobriety milestones and current level.
        </p>

        <Button onClick={handleShare} className="w-full space-x-2">
          <Share2 className="h-4 w-4" />
          <span>Share Link</span>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
