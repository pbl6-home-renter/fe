import { useMutation } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { moderationApi } from '../api/moderation.api';
import type { ReportResponseDto, ReportSubmitRequestDto } from '../types/moderation.dto';

export const useSubmitReportMutation = (options?: MutationHookOptions<ReportResponseDto, ReportSubmitRequestDto>) =>
  useMutation({
    mutationFn: (body: ReportSubmitRequestDto) => moderationApi.submitReport(body),
    ...options,
  });
