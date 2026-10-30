import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { BuildingStatus } from '../enums/building-status.enum';
import {
  buildingInfoSchema,
  type BuildingInfoFormData,
} from './building.schema';
import { useUpdateBuildingMutation } from '../hooks/use-update-building-mutation';
import type {
  BuildingMyDetailDto,
  BuildingUpdateRequestDto,
} from '../types/building.dto';

export interface UseBuildingEditFormOptions {
  building?: BuildingMyDetailDto;
  onSuccess?: () => void;
}

export const useBuildingEditForm = ({ building, onSuccess }: UseBuildingEditFormOptions) => {
  const { t } = useTranslation('buildings');
  const navigate = useNavigate();

  const isApproved = building?.status === BuildingStatus.APPROVED;
  const updateMutation = useUpdateBuildingMutation();

  const form = useForm<BuildingInfoFormData>({
    resolver: zodResolver(buildingInfoSchema),
    defaultValues: {
      name: '',
      province: '',
      ward: '',
      address: '',
      totalFloors: null,
      description: null,
      amenities: {
        elevator: false,
        parking: false,
        securityCamera: false,
        fingerprintLock: false,
      },
    },
    mode: 'onTouched',
  });

  useEffect(() => {
    if (building) {
      form.reset({
        name: building.name,
        province: building.province,
        ward: building.ward,
        address: building.address,
        totalFloors: building.totalFloors ?? null,
        description: null,
        amenities: {
          elevator: Boolean(building.amenities?.elevator),
          parking: Boolean(building.amenities?.parking),
          securityCamera: Boolean(building.amenities?.securityCamera),
          fingerprintLock: Boolean(building.amenities?.fingerprintLock),
        },
      });
    }
  }, [building, form]);

  const handleSubmit = form.handleSubmit((values) => {
    if (!building) return;

    const payload: BuildingUpdateRequestDto = {};

    if (values.name !== building.name) {
      payload.name = values.name.trim();
    }

    if (!isApproved && values.address !== building.address) {
      payload.address = values.address.trim();
    }

    if (Object.keys(payload).length === 0) {
      toast.info(t('messages.noChanges'));
      if (onSuccess) {
        onSuccess();
      } else {
        navigate(`/buildings/${building.id}`);
      }
      return;
    }

    updateMutation.mutate(
      { id: building.id, payload },
      {
        onSuccess: () => {
          if (onSuccess) {
            onSuccess();
          } else {
            navigate(`/buildings/${building.id}`);
          }
        },
      }
    );
  });

  return {
    form,
    isApproved,
    isSubmitting: updateMutation.isPending || form.formState.isSubmitting,
    handleSubmit,
  };
};
