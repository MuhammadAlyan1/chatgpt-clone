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
import Image from 'next/image';

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
          <div className="space-y-6 p-6 rounded-lg border border-neutral-600">
            <div className="space-y-1">
              <h1 className="text-lg font-semibold text-center mt-2">
                Login to TuringTech Test
              </h1>
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
                title="Password"
              />
              {error && (
                <p className="text-sm text-center text-red-600">{error}</p>
              )}
              <Button
                type="submit"
                disabled={isLoading}
                className={'gap-2 w-full h-10 mt-2'}
              >
                <Spinner
                  data-icon="inline-start"
                  className={cn(isLoading ? 'block' : 'hidden')}
                />
                {isLoading ? 'Logging in..' : 'Log in'}
              </Button>
            </form>
            <div className="flex items-center gap-6 text-sm text-zinc-200">
              <span className="h-px flex-1 bg-zinc-600" />
              <span>Or</span>
              <span className="h-px flex-1 bg-zinc-600" />
            </div>
            <ThirdPartyAuthenticator />
            <p className="text-center text-sm text-white">
              Or
              <Link
                href="/register"
                className="font-medium text-amber-400 inline-block px-1"
              >
                click here to sign up
              </Link>
              and get started
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
