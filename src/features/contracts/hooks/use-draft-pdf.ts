import { useEffect, useRef, useState } from 'react';
import { useGenerateDraftContractMutation } from './use-generate-draft-contract-mutation';

export const useDraftPdf = (contractId: string) => {
  const [url, setUrl] = useState<string | null>(null);
  const currentUrl = useRef<string | null>(null);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (currentUrl.current) URL.revokeObjectURL(currentUrl.current);
      currentUrl.current = null;
    };
  }, []);
  const mutation = useGenerateDraftContractMutation({
    onSuccess: (blob) => {
      if (!mounted.current) return;
      if (currentUrl.current) URL.revokeObjectURL(currentUrl.current);
      currentUrl.current = URL.createObjectURL(blob);
      setUrl(currentUrl.current);
    },
  });
  return { url, isPending: mutation.isPending, generate: () => mutation.mutate({ id: contractId }) };
};
