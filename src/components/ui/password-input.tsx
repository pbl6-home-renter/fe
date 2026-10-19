import { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input, type InputProps } from './input';

export type PasswordInputProps = Omit<InputProps, 'type' | 'trailingIcon'>;

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (props, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <Input
        {...props}
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        trailingIcon={
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="p-1 rounded-md text-rentify-text-secondary hover:text-rentify-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-rentify-primary cursor-pointer transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Eye className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        }
      />
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
