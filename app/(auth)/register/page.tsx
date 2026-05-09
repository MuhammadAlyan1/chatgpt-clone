'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Checkbox } from '@/components/ui/checkbox';
import { TextField } from '@/components/shared/TextField';
import { ThirdPartyAuthenticator } from '../third-party-authenticator';
import { createClient } from '@/lib/supabase/client';
import { cn, isEmailValid, isPasswordValid } from '@/lib/utils';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
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
    if (!hasAcceptedTerms) {
      setError('You must accept the terms and conditions and privacy policy');
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
      setEmail('');
      setPassword('');
    } catch (error: any) {
      setError(error?.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex">
      <div className="flex w-full min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-center gap-4 mb-8">
            <Image
              src={'/turing-technologies-logo.png'}
              width={70}
              height={60}
              alt="Turing Technologies Logo"
            />
            <h1 className="text-white text-3xl font-bold">TuringTech Test</h1>
          </div>
          {hasSubmitted && (
            <div className="space-y-2 rounded-md border mb-4 border-neutral-600 p-4 text-center">
              <h2 className="text-base font-semibold">Check your email</h2>
              <p className="text-sm text-zinc-400">
                We sent you a confirmation link. Click it to activate your
                account, then return to sign in.
              </p>
            </div>
          )}
          <div className="space-y-6 p-6 rounded-lg border border-neutral-600">
            <div className="space-y-1">
              <h1 className="text-lg font-semibold text-center mt-2">
                Create your TuringTech Test account
              </h1>
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
                  email && !isEmailValid(email)
                    ? 'Enter a valid email address'
                    : ''
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
              <label className="flex items-start gap-2 text-sm text-white cursor-pointer mb-3">
                <Checkbox
                  checked={hasAcceptedTerms}
                  onCheckedChange={(checked) =>
                    setHasAcceptedTerms(checked === true)
                  }
                  className="mt-0.5"
                />
                <span>
                  I accept the{' '}
                  <Link
                    href="/terms-and-condition"
                    className="font-medium text-amber-400"
                  >
                    terms and conditions
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/privacy-policy"
                    className="font-medium text-amber-400"
                  >
                    privacy policy
                  </Link>
                </span>
              </label>
              {error && (
                <p className="text-sm text-center text-red-600">{error}</p>
              )}
              <Button
                type="submit"
                disabled={isLoading || !hasAcceptedTerms}
                className={'gap-2 w-full h-10 mt-2'}
              >
                <Spinner
                  data-icon="inline-start"
                  className={cn(isLoading ? 'block' : 'hidden')}
                />
                {isLoading ? 'Creating Account..' : 'Create Account'}
              </Button>
            </form>
            <div className="flex items-center gap-6 text-sm text-zinc-200">
              <span className="h-px flex-1 bg-zinc-600" />
              <span>Or</span>
              <span className="h-px flex-1 bg-zinc-600" />
            </div>
            <ThirdPartyAuthenticator />
            <p className="text-center text-sm text-white">
              Already have an account?
              <Link
                href="/login"
                className="font-medium text-amber-400 inline-block px-1"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="w-full min-h-screen bg-zinc-900 items-center justify-center hidden lg:flex">
        <div className="w-[30vw] aspect-square bg-zinc-800"></div>
      </div>
    </div>
  );
}
