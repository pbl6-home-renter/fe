import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

export interface NavItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

export interface NavProps {
  items: NavItem[];
  className?: string;
  onItemClick?: () => void;
}

export const Nav = ({ items, className, onItemClick }: NavProps) => {
  return (
    <nav className={cn('space-y-1', className)}>
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={onItemClick}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors',
              isActive
                ? 'bg-[var(--color-rentify-primary-container,#E8F1FC)] text-[var(--color-rentify-primary,#1E6FD9)] font-semibold'
                : 'text-[var(--color-rentify-text-secondary,#5C7290)] hover:text-[var(--color-rentify-text-primary,#142A4C)] hover:bg-[var(--color-rentify-background,#F8FBFE)]'
            )
          }
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default Nav;

