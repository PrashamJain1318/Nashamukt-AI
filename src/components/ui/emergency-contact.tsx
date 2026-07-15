import { PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function EmergencyContact() {
  const handleEmergencyCall = () => {
    // In a real app, this might trigger a tel: link or open a modal to select an emergency contact.
    window.location.href = 'tel:112'; // Default Indian Emergency Helpline
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Button
        onClick={handleEmergencyCall}
        size="icon"
        className="h-14 w-14 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-2xl shadow-red-500/50 flex items-center justify-center relative overflow-hidden group"
      >
        <span className="absolute inset-0 w-full h-full bg-red-400 opacity-0 group-hover:opacity-20 transition-opacity" />
        <PhoneCall className="h-6 w-6" />
      </Button>
    </motion.div>
  );
}
