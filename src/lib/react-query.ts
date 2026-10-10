export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  buildings: {
    all: ['buildings'] as const,
    detail: (id: string) => ['buildings', id] as const,
  },
};