import { useTranslation } from 'react-i18next';

export const ChatTypingIndicator = ({ names }: { names: string[] }) => {
  const { t } = useTranslation('chat');
  if (names.length === 0) return null;
  return (
    <p
      aria-live="polite"
      className="pointer-events-none absolute bottom-2 left-5 rounded-full bg-rentify-surface px-3 py-1 text-xs text-rentify-text-secondary shadow-sm"
    >
      {names.length === 1 ? t('typingOne', { name: names[0] }) : t('typingMany', { count: names.length })}
    </p>
  );
};
