import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { roommateProfileSchema, type RoommateProfileFormData } from '../forms/roommate-profile.schema';
import { useMyRoommateProfileQuery } from './use-my-roommate-profile-query';
import { useSaveRoommateProfileMutation } from './use-save-roommate-profile-mutation';

export const useRoommateProfileForm = (onSuccessCallback?: () => void) => {
  const { data: profile, isLoading: isFetchingProfile } = useMyRoommateProfileQuery();
  const saveMutation = useSaveRoommateProfileMutation({
    onSuccess: () => {
      onSuccessCallback?.();
    },
  });

  const form = useForm<RoommateProfileFormData>({
    resolver: zodResolver(roommateProfileSchema),
    defaultValues: {
      isVisible: true,
      bio: '',
      gender: null,
      birthYear: null,
      occupation: '',
      preferredProvince: '',
      preferredDistrict: '',
      preferredArea: '',
      budgetMin: null,
      budgetMax: null,
      moveInOn: '',
      lifestyle: {
        cleanAndTidy: false,
        earlyBird: false,
        nightOwl: false,
        petFriendly: false,
        smoking: false,
        cooking: false,
        guestsAllowed: false,
      },
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        isVisible: profile.isVisible,
        bio: profile.bio ?? '',
        gender: (profile.gender as 'male' | 'female' | 'other') ?? null,
        birthYear: profile.birthYear,
        occupation: profile.occupation ?? '',
        preferredProvince: profile.preferredProvince ?? '',
        preferredDistrict: profile.preferredDistrict ?? '',
        preferredArea: profile.preferredArea ?? '',
        budgetMin: profile.budgetMin,
        budgetMax: profile.budgetMax,
        moveInOn: profile.moveInOn ?? '',
        lifestyle: {
          cleanAndTidy: Boolean(profile.lifestyle?.cleanAndTidy),
          earlyBird: Boolean(profile.lifestyle?.earlyBird),
          nightOwl: Boolean(profile.lifestyle?.nightOwl),
          petFriendly: Boolean(profile.lifestyle?.petFriendly),
          smoking: Boolean(profile.lifestyle?.smoking),
          cooking: Boolean(profile.lifestyle?.cooking),
          guestsAllowed: Boolean(profile.lifestyle?.guestsAllowed),
        },
      });
    }
  }, [profile, form]);

  const onSubmit = form.handleSubmit((data) => {
    saveMutation.mutate({
      isVisible: data.isVisible,
      bio: data.bio?.trim() || null,
      gender: data.gender && ['male', 'female', 'other'].includes(data.gender) ? data.gender : null,
      birthYear: data.birthYear ? Number(data.birthYear) : null,
      occupation: data.occupation?.trim() || null,
      preferredProvince: data.preferredProvince?.trim() || null,
      preferredDistrict: data.preferredDistrict?.trim() || null,
      preferredArea: data.preferredArea?.trim() || null,
      budgetMin: data.budgetMin != null && !Number.isNaN(Number(data.budgetMin)) ? Number(data.budgetMin) : null,
      budgetMax: data.budgetMax != null && !Number.isNaN(Number(data.budgetMax)) ? Number(data.budgetMax) : null,
      moveInOn: data.moveInOn?.trim() ? data.moveInOn.trim() : null,
      lifestyle: data.lifestyle || null,
    });
  });

  return {
    form,
    profile,
    isFetchingProfile,
    isSaving: saveMutation.isPending,
    onSubmit,
  };
};
