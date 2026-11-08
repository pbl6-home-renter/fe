export type PasswordCriterionKey =
  | 'passwordCriteria.minLength'
  | 'passwordCriteria.uppercase'
  | 'passwordCriteria.lowercase'
  | 'passwordCriteria.number';

export interface PasswordCriterion {
  id: 'minLength' | 'uppercase' | 'lowercase' | 'number';
  labelKey: PasswordCriterionKey;
  met: boolean;
}

export const getPasswordCriteria = (password: string = ''): PasswordCriterion[] => [
  {
    id: 'minLength',
    labelKey: 'passwordCriteria.minLength',
    met: password.length >= 8,
  },
  {
    id: 'uppercase',
    labelKey: 'passwordCriteria.uppercase',
    met: /[A-Z]/.test(password),
  },
  {
    id: 'lowercase',
    labelKey: 'passwordCriteria.lowercase',
    met: /[a-z]/.test(password),
  },
  {
    id: 'number',
    labelKey: 'passwordCriteria.number',
    met: /[0-9]/.test(password),
  },
];

export const isAllPasswordCriteriaMet = (password: string = ''): boolean =>
  getPasswordCriteria(password).every((criterion) => criterion.met);
