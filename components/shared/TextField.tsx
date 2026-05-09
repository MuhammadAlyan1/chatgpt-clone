'use client';

import { useId, useState } from 'react';
import type { ComponentProps } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type TextFieldProps = Omit<
  ComponentProps<typeof Input>,
  'onChange' | 'value'
> & {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  errorText?: string;
  placeholder?: string;
  classes?: {
    container?: string;
    label?: string;
    input?: string;
    error?: string;
  };
};

export function TextField({
  label,
  value,
  onChange,
  errorText,
  placeholder,
  id,
  type,
  classes = {
    container: '',
    label: '',
    input: '',
    error: '',
  },
  ...rest
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hasError = Boolean(errorText);
  const isPassword = type === 'password';
  const [showPassword, setShowPassword] = useState(false);
  const resolvedType = isPassword && showPassword ? 'text' : type;

  return (
    <Field
      data-invalid={hasError || undefined}
      className={cn(classes.container)}
    >
      {label && (
        <FieldLabel htmlFor={inputId} className={cn(classes.input)}>
          {label}
        </FieldLabel>
      )}
      <div className="relative">
        <Input
          id={inputId}
          type={resolvedType}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? `${inputId}-error` : undefined}
          className={cn('h-10', isPassword && 'pr-9', classes.input)}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            tabIndex={-1}
            className="absolute inset-y-0 right-0 flex items-center px-2.5 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      {hasError && (
        <FieldError
          id={`${inputId}-error`}
          className={cn('text-xs px-2', classes.error)}
        >
          {errorText}
        </FieldError>
      )}
    </Field>
  );
}
