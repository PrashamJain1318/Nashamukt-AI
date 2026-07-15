import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '@/lib/api-client';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Activity, Trophy, Shield, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface PublicUser {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  memberSince: string;
  currentStreak: number;
}

export function PublicProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.get(`/api/public/profile/${userId}`);
        setUser(response.data.data.user);
      } catch (error) {
        console.error("Failed to fetch public profile", error);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
        <Link to="/" className="text-primary hover:underline">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card border border-border/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary/20 to-secondary/20" />
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-background border-4 border-card p-1 shadow-xl mb-4">
            <div className="w-full h-full rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-primary">{user.name.charAt(0)}</span>
              )}
            </div>
          </div>

          <h1 className="text-3xl font-display font-bold mb-1">{user.name}</h1>
          <p className="text-muted-foreground flex items-center justify-center space-x-1 mb-8">
            <Calendar className="h-4 w-4" />
            <span>Member since {new Date(user.memberSince).getFullYear()}</span>
          </p>

          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="bg-secondary/30 p-4 rounded-2xl flex flex-col items-center">
              <Trophy className="h-8 w-8 text-yellow-500 mb-2" />
              <span className="text-2xl font-bold">{user.level}</span>
              <span className="text-xs text-muted-foreground uppercase font-medium">Level</span>
            </div>
            <div className="bg-secondary/30 p-4 rounded-2xl flex flex-col items-center">
              <Shield className="h-8 w-8 text-primary mb-2" />
              <span className="text-2xl font-bold">{user.currentStreak}</span>
              <span className="text-xs text-muted-foreground uppercase font-medium">Days Clean</span>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link to="/" className="inline-flex items-center justify-center space-x-2 text-sm text-primary font-medium hover:opacity-80 transition-opacity">
            <Activity className="h-4 w-4" />
            <span>Powered by NashaMukt AI</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
