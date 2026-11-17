import { Cigarette, Flame, Heart, Moon, Sparkles, Sun, Users } from 'lucide-react';
import type { ListParams } from '@/types/api';
import type {
  MatchRequestListFilterDto,
  MatchRequestStatus,
  RoommateLifestyle,
  RoommateProfileSearchFilterDto,
} from '../types/roommate.dto';

export const ROOMMATE_QUERY_KEYS = {
  all: ['roommates'] as const,
  myProfile: () => [...ROOMMATE_QUERY_KEYS.all, 'my-profile'] as const,
  profiles: (params?: ListParams<RoommateProfileSearchFilterDto>) =>
    [...ROOMMATE_QUERY_KEYS.all, 'profiles', params] as const,
  profileDetail: (id: string) => [...ROOMMATE_QUERY_KEYS.all, 'detail', id] as const,
  matchRequests: (params?: ListParams<MatchRequestListFilterDto>) =>
    [...ROOMMATE_QUERY_KEYS.all, 'match-requests', params] as const,
};

export interface LifestyleConfigItem {
  key: keyof RoommateLifestyle;
  labelKey:
    | 'lifestyle.cleanAndTidy'
    | 'lifestyle.earlyBird'
    | 'lifestyle.nightOwl'
    | 'lifestyle.petFriendly'
    | 'lifestyle.smoking'
    | 'lifestyle.cooking'
    | 'lifestyle.guestsAllowed';
  icon: typeof Sparkles;
}

export const LIFESTYLE_ITEMS: LifestyleConfigItem[] = [
  { key: 'cleanAndTidy', labelKey: 'lifestyle.cleanAndTidy', icon: Sparkles },
  { key: 'earlyBird', labelKey: 'lifestyle.earlyBird', icon: Sun },
  { key: 'nightOwl', labelKey: 'lifestyle.nightOwl', icon: Moon },
  { key: 'petFriendly', labelKey: 'lifestyle.petFriendly', icon: Heart },
  { key: 'smoking', labelKey: 'lifestyle.smoking', icon: Cigarette },
  { key: 'cooking', labelKey: 'lifestyle.cooking', icon: Flame },
  { key: 'guestsAllowed', labelKey: 'lifestyle.guestsAllowed', icon: Users },
];

export const ROOMMATE_GENDER_OPTIONS = [
  { value: 'all', labelKey: 'gender.all' },
  { value: 'male', labelKey: 'gender.male' },
  { value: 'female', labelKey: 'gender.female' },
  { value: 'other', labelKey: 'gender.other' },
] as const;

export const GENDER_LABEL_KEYS = {
  male: 'gender.male',
  female: 'gender.female',
  other: 'gender.other',
} as const;

export type RoommateGender = keyof typeof GENDER_LABEL_KEYS;

export const getGenderLabelKey = (
  gender: string | null | undefined,
): 'gender.male' | 'gender.female' | 'gender.other' | null => {
  if (gender && gender in GENDER_LABEL_KEYS) {
    return GENDER_LABEL_KEYS[gender as RoommateGender];
  }
  return null;
};

export const MATCH_REQUEST_STATUS_MAP: Record<
  MatchRequestStatus,
  {
    labelKey: 'status.pending' | 'status.accepted' | 'status.rejected' | 'status.withdrawn';
    variant: 'warning' | 'success' | 'error' | 'default';
  }
> = {
  pending: { labelKey: 'status.pending', variant: 'warning' },
  accepted: { labelKey: 'status.accepted', variant: 'success' },
  rejected: { labelKey: 'status.rejected', variant: 'error' },
  withdrawn: { labelKey: 'status.withdrawn', variant: 'default' },
};
