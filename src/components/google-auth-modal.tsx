'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useResumeStore, UserProfile } from '@/lib/resume-store';
import { toast } from 'sonner';
import { Check, ShieldCheck, Sparkles, Loader2, Database } from 'lucide-react';

interface GoogleAuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GoogleAuthModal({ open, onOpenChange }: GoogleAuthModalProps) {
  const { user, loginWithGoogle, logout } = useResumeStore();
  const [loadingAccount, setLoadingAccount] = useState<string | null>(null);

  const mockGoogleAccounts: Partial<UserProfile>[] = [
    {
      id: 'usr-google-alex',
      name: 'Alex Vance',
      email: 'alex.vance@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'usr-google-sarah',
      name: 'Sarah Connor',
      email: 'sarah.c.dev@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'usr-google-david',
      name: 'David Kim',
      email: 'david.kim.ai@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
  ];

  const handleSelectAccount = (account: Partial<UserProfile>) => {
    setLoadingAccount(account.email || 'account');
    setTimeout(() => {
      loginWithGoogle(account);
      setLoadingAccount(null);
      onOpenChange(false);
      toast.success(`Signed in as ${account.name}`, {
        description: 'Synced with Neon DB cloud storage & Google Profile.',
      });
    }, 700);
  };

  const handleCustomAccount = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;

    if (!email.includes('@')) {
      toast.error('Please enter a valid Google email address');
      return;
    }

    setLoadingAccount(email);
    setTimeout(() => {
      loginWithGoogle({
        name: name || 'Google User',
        email,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || email)}`,
      });
      setLoadingAccount(null);
      onOpenChange(false);
      toast.success(`Signed in as ${name || email}`);
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6 bg-card border-border shadow-2xl">
        <DialogHeader className="text-center sm:text-center pb-2">
          {/* Google G Icon */}
          <div className="mx-auto w-12 h-12 rounded-full border border-border bg-background flex items-center justify-center mb-2 shadow-sm">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>
          <DialogTitle className="text-xl font-bold font-display">
            Sign in with Google
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Connect your Google account to automatically sync your resumes with our Neon PostgreSQL cloud database.
          </DialogDescription>
        </DialogHeader>

        {user && (
          <div className="mb-4 p-3 rounded-lg bg-secondary/50 border border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover border border-primary/30"
              />
              <div className="text-left">
                <p className="text-sm font-semibold leading-none">{user.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logout();
                toast.info('Signed out');
              }}
              className="text-xs h-8 text-destructive hover:text-destructive"
            >
              Sign out
            </Button>
          </div>
        )}

        {/* Account Selector */}
        <div className="space-y-2 mt-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Choose an account
          </p>
          {mockGoogleAccounts.map((acc) => {
            const isCurrent = user?.email === acc.email;
            const isLoading = loadingAccount === acc.email;

            return (
              <button
                key={acc.id}
                onClick={() => handleSelectAccount(acc)}
                disabled={isLoading}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/40 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={acc.avatar}
                    alt={acc.name || ''}
                    className="w-10 h-10 rounded-full object-cover border border-border group-hover:border-primary transition-colors"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {acc.name}
                      </span>
                      {isCurrent && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-accent/20 text-accent">
                          Active
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{acc.email}</span>
                  </div>
                </div>

                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                ) : isCurrent ? (
                  <Check className="w-4 h-4 text-accent" />
                ) : (
                  <span className="text-xs text-muted-foreground group-hover:text-primary font-medium">
                    Select →
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Or enter custom Google Email */}
        <div className="mt-4 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Or connect with any Google address:</p>
          <form onSubmit={handleCustomAccount} className="space-y-2">
            <input
              type="text"
              name="name"
              placeholder="Full Name (e.g. Jordan Lee)"
              className="w-full text-xs px-3 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="flex gap-2">
              <input
                type="email"
                name="email"
                required
                placeholder="name@gmail.com"
                className="flex-1 text-xs px-3 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Button type="submit" size="sm" className="h-9 px-3 text-xs">
                Continue
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-4 p-2.5 rounded-lg bg-muted/40 border border-border flex items-start gap-2.5 text-[11px] text-muted-foreground">
          <Database className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
          <span>
            Resumes and 72h job matches automatically persist across sessions under your Google profile linked with Neon PostgreSQL.
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
