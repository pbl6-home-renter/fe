import { useAuth } from '@/features/auth/hooks/use-auth';
import { Role } from '@/types/role';
import landlordLogo from '@/assets/landlord-logo.png';
import tenantLogo from '@/assets/tenant-logo.png';

interface RentifyLogoProps {
  role?: Role | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

export const RentifyLogo = ({
  role: roleProp,
  size = 'md',
  className = '',
  showText = true,
}: RentifyLogoProps) => {
  const { role: authRole } = useAuth();
  const activeRole = roleProp !== undefined ? roleProp : authRole;

  const logoSrc = activeRole === Role.TENANT ? tenantLogo : landlordLogo;

  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }[size];

  const textSizeClasses = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`relative ${sizeClasses} shrink-0 flex items-center justify-center`}>
        <img
          src={logoSrc}
          alt="Rentify Logo"
          className="w-full h-full object-contain"
          onError={(e) => {
            // Fallback sang SVG nếu ảnh PNG không khả dụng
            e.currentTarget.style.display = 'none';
          }}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 40 40"
          className="w-full h-full hidden text-rentify-primary"
          fill="none"
        >
          <rect width="40" height="40" rx="10" fill="currentColor" fillOpacity="0.1" />
          <path
            d="M10 21L20 12L30 21V28C30 29.1 29.1 30 28 30H12C10.9 30 10 29.1 10 28V21Z"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 30V22H24V30"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {showText && (
        <span
          className={`font-bold ${textSizeClasses} text-rentify-text-primary tracking-tight leading-none`}
        >
          Rentify
        </span>
      )}
    </div>
  );
};
