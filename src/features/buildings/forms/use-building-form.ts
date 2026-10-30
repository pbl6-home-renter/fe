import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  buildingInfoSchema,
  type BuildingInfoFormData,
} from './building.schema';
import { useCreateBuildingMutation } from '../hooks/use-create-building-mutation';
import type { BuildingCreateRequestDto } from '../types/building.dto';

export interface UseBuildingFormOptions {
  onSuccess?: (buildingId: string) => void;
}

export const useBuildingForm = (options?: UseBuildingFormOptions) => {
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);
  const [mediaIds, setMediaIds] = useState<string[]>([]);

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

  const createMutation = useCreateBuildingMutation();

  const goToNextStep = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      setStep(2);
    }
  };

  const goToPrevStep = () => {
    setStep(1);
  };

  const reset = () => {
    form.reset();
    setStep(1);
    setMediaIds([]);
  };

  const handleSubmit = () => {
    const info = form.getValues();
    const payload: BuildingCreateRequestDto = {
      name: info.name.trim(),
      province: info.province.trim(),
      ward: info.ward.trim(),
      address: info.address.trim(),
    };

    createMutation.mutate(payload, {
      onSuccess: (response) => {
        if (options?.onSuccess) {
          options.onSuccess(response.id);
        } else {
          navigate(`/buildings/${response.id}`, { replace: true });
        }
      },
    });
  };

  return {
    form,
    step,
    mediaIds,
    setMediaIds,
    goToNextStep,
    goToPrevStep,
    handleSubmit,
    reset,
    isSubmitting: createMutation.isPending,
  };
};
