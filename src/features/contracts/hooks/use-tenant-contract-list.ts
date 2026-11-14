import { useSearchParams } from 'react-router-dom';
import { ContractStatus } from '../enums/contract-status.enum';
import { useMyContractsQuery } from './use-my-contracts-query';

export const useTenantContractList = () => {
  const [params, setParams] = useSearchParams();
  const rawPage = params.get('page') ?? '';
  const parsedPage = /^\d+$/.test(rawPage) ? Number(rawPage) : 1;
  const pageNo = Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const rawStatus = params.get('status') ?? '';
  const status = Object.values(ContractStatus).find((value) => value === rawStatus);
  const query = useMyContractsQuery({ pageNo, filter: status ? { status } : undefined });
  const setPage = (page: number) => setParams((current) => {
    const next = new URLSearchParams(current);
    next.set('page', String(page));
    return next;
  });
  const setStatus = (value: string) => setParams((current) => {
    const next = new URLSearchParams(current);
    if (value) next.set('status', value); else next.delete('status');
    next.delete('page');
    return next;
  });
  return { ...query, pageNo, status: status ?? '', setPage, setStatus };
};
