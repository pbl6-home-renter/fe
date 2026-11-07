import { z } from 'zod';
import { MeterType } from '../enums/meter-type.enum';
import { METER_READING_PATTERNS } from '../constants/meter-reading.constants';

export const meterReadingValueSchema = z
  .string()
  .trim()
  .min(1, 'errors.readingRequired')
  .regex(METER_READING_PATTERNS.DECIMAL, 'errors.readingInvalid');

export const singleMeterReadingFormSchema = z
  .object({
    roomId: z.string().uuid('errors.roomRequired'),
    type: z.enum([MeterType.ELECTRICITY, MeterType.WATER]),
    period: z.string().regex(METER_READING_PATTERNS.PERIOD, 'errors.periodInvalid'),
    currentReading: meterReadingValueSchema,
    previousReading: z.string().optional(),
    isBaseline: z.boolean().default(false),
    evidenceMediaId: z.string().uuid('errors.evidenceRequired'),
  })
  .refine(
    (data) => {
      if (data.isBaseline || !data.previousReading) return true;
      const prev = parseFloat(data.previousReading);
      const curr = parseFloat(data.currentReading);
      if (isNaN(prev) || isNaN(curr)) return true;
      return curr >= prev;
    },
    {
      message: 'errors.readingLessThanPrevious',
      path: ['currentReading'],
    },
  );

export type SingleMeterReadingFormData = z.infer<typeof singleMeterReadingFormSchema>;
