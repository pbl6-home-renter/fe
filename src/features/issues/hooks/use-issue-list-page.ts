import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { ROUTES } from '@/config/routes.config';
import { Role } from '@/types/role';
import type { IssueStatus } from '../types/issue.dto';
import { useIssuesQuery } from './use-issues-query';

export const useIssueListPage = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
  const tenant = role === Role.TENANT;
  const [pageNo, setPageNo] = useState(1);
  const [status, setStatus] = useState<IssueStatus | ''>('');
  const [createOpen, setCreateOpen] = useState(false);
  const query = useIssuesQuery(
    tenant,
    { pageNo, filter: status ? { status } : {} },
    { enabled: role === Role.TENANT || role === Role.LANDLORD },
  );
  return {
    tenant,
    query,
    pageNo,
    setPageNo,
    status,
    createOpen,
    setCreateOpen,
    setStatus: (value: IssueStatus | '') => {
      setStatus(value);
      setPageNo(1);
    },
    openIssue: (id: string) => navigate(ROUTES.ISSUE_DETAIL(id)),
    onCreated: (id: string) => {
      setCreateOpen(false);
      navigate(ROUTES.ISSUE_DETAIL(id));
    },
  };
};
