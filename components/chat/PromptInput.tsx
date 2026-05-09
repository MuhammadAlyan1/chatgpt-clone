'use client';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Brain, PlusIcon, Search, Send } from 'lucide-react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '../ui/input-group';
import { Spinner } from '../ui/spinner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

type PromptInputProps = {
  onSubmit: (message: string) => void | Promise<void>;
  isLoading?: boolean;
  placeholder?: string;
};

function PromptInput({
  onSubmit,
  isLoading = false,
  placeholder = 'Ask something...',
}: PromptInputProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt || isLoading) return;
    setPrompt('');
    onSubmit(trimmedPrompt);
  };

  return (
    <div className="w-full max-w-[55em]">
      <form onSubmit={handleSubmit}>
        <InputGroup className="h-12 rounded-full">
          <InputGroupInput
            name="message"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
            placeholder={placeholder}
            autoComplete="off"
          />
          <InputGroupAddon role="button">
            <DropdownMenu>
              <DropdownMenuTrigger className="px-4 pr-1 hover:text-white cursor-pointer">
                <PlusIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className={'py-2'}>
                <DropdownMenuItem onClick={() => toast('Coming soon')}>
                  <Brain />
                  Reasoning
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast('Coming soon')}>
                  <Search />
                  Web search
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </InputGroupAddon>
          <InputGroupAddon align="inline-end" role="button">
            <button
              type="submit"
              disabled={isLoading || prompt.trim().length === 0}
              className="flex px-4 hover:text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? <Spinner className="h-6 w-6" /> : <Send />}
            </button>
          </InputGroupAddon>
        </InputGroup>
      </form>
    </div>
  );
}

export default PromptInput;
