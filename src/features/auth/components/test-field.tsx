import type { InputHTMLAttributes } from 'react';
import { Input } from '@/components/ui/input';

export interface TestFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const TestField = ({ label = 'Test Field', error, ...props }: TestFieldProps) => {
  return <Input label={label} error={error} {...props} />;
};

