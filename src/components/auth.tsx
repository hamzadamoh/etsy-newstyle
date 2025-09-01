
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface AuthProps {
  onAuthSuccess: () => void;
}

export function Auth({ onAuthSuccess }: AuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const { signUp, login, sendPasswordReset } = useAuth();

  const handleSignUp = async () => {
    setError(null);
    try {
      await signUp(email, password);
      onAuthSuccess();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogin = async () => {
    setError(null);
    try {
      await login(email, password);
      onAuthSuccess();
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  const handleForgotPassword = async () => {
    setError(null);
    setResetMessage('');
    try {
      await sendPasswordReset(resetEmail);
      setResetMessage('A password reset link has been sent to your email.');
    } catch (err: any) {
       setError(err.message);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button onClick={handleLogin} className="w-full">Login</Button>
        <Button onClick={handleSignUp} variant="secondary" className="w-full">Sign Up</Button>
      </div>
      <div className="text-center">
        <Button variant="link" onClick={() => setIsForgotPasswordOpen(true)}>
          Forgot Password?
        </Button>
      </div>

      <Dialog open={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
             {resetMessage && (
                <Alert>
                    <AlertDescription>{resetMessage}</AlertDescription>
                </Alert>
            )}
            <div className="space-y-2">
                <Label htmlFor="reset-email">Your Email</Label>
                <Input
                id="reset-email"
                type="email"
                placeholder="m@example.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleForgotPassword}>Send Reset Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
