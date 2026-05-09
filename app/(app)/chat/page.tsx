'use client';
import { useState } from 'react';
import Image from 'next/image';
import PromptInput from '@/components/shared/PromptInput';

export default function NewChatPage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <Image
        src={'/turing-technologies-logo-large.png'}
        width={207}
        height={178}
        alt={'Turing Technologies logo'}
        className="mb-16"
      />
      <PromptInput onSubmit={() => setIsLoading(true)} isLoading={isLoading} />
    </div>
  );
}
