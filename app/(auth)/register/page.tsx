'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { TextField } from '@/components/shared/TextField';
import { ThirdPartyAuthenticator } from '../third-party-authenticator';
import { createClient } from '@/lib/supabase/client';
import { cn, isEmailValid, isPasswordValid } from '@/lib/utils';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const register = async (email: string, password: string) => {
    if (!isEmailValid(email)) {
      setError('Enter a valid email');
      return;
    }
    if (!isPasswordValid(password)) {
      setError(
        'Password must contain at least 8 characters, an uppercase letter, a special character, and a number'
      );
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setHasSubmitted(false);
      const supabase = await createClient();
      const { error: registrationError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_ORIGIN}/auth/callback`,
        },
      });

      if (registrationError) {
        setError(registrationError.message);
        return;
      }

      setHasSubmitted(true);
    } catch (error: any) {
      setError(error?.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        {hasSubmitted && (
          <div className="space-y-2 rounded-md border border-zinc-200 p-4 text-center dark:border-zinc-800">
            <h2 className="text-base font-semibold">Check your email</h2>
            <p className="text-sm text-zinc-500">
              We sent you a confirmation link. Click it to activate your
              account, then return to sign in.
            </p>
          </div>
        )}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Create your account</h1>
          <p className="text-sm text-zinc-500">
            We'll send a confirmation link to your email.
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e?.preventDefault();
            register(email, password);
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
            errorText={
              password && !isPasswordValid(password)
                ? 'Password must contain at least 8 characters, an uppercase letter, a special character, and a number'
                : ''
            }
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
            {isLoading ? 'Creating Account..' : 'Create Account'}
          </Button>
        </form>
        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
          <span>or</span>
          <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <ThirdPartyAuthenticator />
        <p className="text-center text-sm text-zinc-500">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-zinc-900 underline dark:text-zinc-100"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
