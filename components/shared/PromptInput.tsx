'use client';
import React from 'react';
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
  onSubmit: () => void;
  isLoading?: boolean;
};

function PromptInput({ onSubmit, isLoading = false }: PromptInputProps) {
  return (
    <div className="w-full max-w-[55em]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <InputGroup className="h-12 rounded-full">
          <InputGroupInput
            disabled={isLoading}
            placeholder="Ask something..."
          />
          <InputGroupAddon role="button">
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer">
                <button
                  type="button"
                  className="flex px-4 pr-1 hover:text-white cursor-pointer"
                >
                  <PlusIcon />
                </button>
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
              disabled={isLoading}
              className="flex px-4 hover:text-white cursor-pointer"
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
