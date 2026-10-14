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
                ? 'bg-rentify-primary-container text-rentify-primary font-semibold'
                : 'text-rentify-text-secondary hover:text-rentify-text-primary hover:bg-rentify-background'
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

