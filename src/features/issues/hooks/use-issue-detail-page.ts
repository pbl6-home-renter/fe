import { useState, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ROUTES } from '@/config/routes.config';
import { useMediaUpload } from '@/features/media/hooks/use-media-upload';
import { MediaOwnerType, MediaPurpose } from '@/features/media/types/media.dto';
import { ISSUE_QUERY_KEYS } from '../constants/issue.constants';
import { useIssueCancelMutation } from './use-issue-cancel-mutation';
import { useIssueQuery } from './use-issue-query';
import { useIssueUpdateMutation } from './use-issue-update-mutation';

export const useIssueDetailPage = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const query = useIssueQuery(id);
  const update = useIssueUpdateMutation(id);
  const cancel = useIssueCancelMutation(id);
  const upload = useMediaUpload();
  const client = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const uploadFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !id) return;
    upload.upload(
      { file, ownerType: MediaOwnerType.ISSUE_REPORT, ownerId: id, purpose: MediaPurpose.ISSUE_PHOTO },
      {
        onSuccess: () => void client.invalidateQueries({ queryKey: ISSUE_QUERY_KEYS.DETAIL(id) }),
      },
    );
  };
  return {
    query,
    editOpen,
    setEditOpen,
    cancelOpen,
    setCancelOpen,
    uploadFile,
    upload,
    goBack: () => navigate(ROUTES.ISSUES),
    advance: (status: 'in_progress' | 'resolved') => update.mutate({ status }),
    confirmCancel: () => cancel.mutate(undefined, { onSuccess: () => setCancelOpen(false) }),
    isUpdating: update.isPending,
    isCancelling: cancel.isPending,
  };
};
