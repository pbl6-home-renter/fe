import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface FormItemProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: ReactNode;
}

export const FormItem = forwardRef<HTMLDivElement, FormItemProps>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('flex flex-col gap-1.5 w-full text-left', className)} {...props}>
      {children}
    </div>
  );
});

FormItem.displayName = 'FormItem';

export interface FormFieldProps extends FormItemProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  htmlFor?: string;
}

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ label, error, helperText, required, htmlFor, className, children, ...props }, ref) => {
    return (
      <FormItem ref={ref} className={className} {...props}>
        {label && (
          <label htmlFor={htmlFor} className="text-sm font-medium text-rentify-text-primary">
            {label}
            {required && <span className="text-rentify-error ml-1">*</span>}
          </label>
        )}
        {children}
        {error ? (
          <p role="alert" className="flex items-start gap-1.5 text-xs font-medium text-rentify-error mt-0.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p className="text-xs text-rentify-text-secondary mt-0.5">{helperText}</p>
        ) : null}
      </FormItem>
    );
  },
);

FormField.displayName = 'FormField';
