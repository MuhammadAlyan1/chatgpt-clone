'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TextField } from '@/components/shared/TextField';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ThirdPartyAuthenticator } from '../third-party-authenticator';
import { createClient } from '@/lib/supabase/client';
import { cn, isEmailValid } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    if (!isEmailValid(email)) {
      setError('Enter a valid email');
      return;
    }
    if (!password) {
      setError('Enter your password');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const supabase = await createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.push('/chat');
    } catch (error: any) {
      console.log('ERROR: ', error);
      setError(error?.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Sign in</h1>
          <p className="text-sm text-zinc-500">
            Enter your email and password to continue.
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e?.preventDefault();
            login(email, password);
          }}
          className="space-y-4"
        >
          {/* It should have a label, but due to the Figma design I'm removing */}
          <TextField
            id="email"
            type="email"
            value={email}
            placeholder="Email"
            onChange={(val) => setEmail(val)}
            errorText={
              email && !isEmailValid(email) ? 'Enter a valid email address' : ''
            }
            title="Email"
          />
          <TextField
            id="Password"
            type="password"
            placeholder="password"
            value={password}
            onChange={(val) => setPassword(val)}
            title="Password"
          />
          {error && <p className="text-sm text-center text-red-600">{error}</p>}
          <Button
            type="submit"
            disabled={isLoading}
            className={'gap-2 w-full h-10 mt-4'}
          >
            <Spinner
              data-icon="inline-start"
              className={cn(isLoading ? 'block' : 'hidden')}
            />
            {isLoading ? 'Signing in..' : 'Sign in'}
          </Button>
        </form>
        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
          <span>or</span>
          <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <ThirdPartyAuthenticator />
        <p className="text-center text-sm text-zinc-500">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="font-medium text-zinc-900 underline dark:text-zinc-100"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
