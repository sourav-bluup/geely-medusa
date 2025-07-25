import { z } from 'zod';

export enum MediaType {
  MAIN = 'main',
  FRONT = 'front',
  BACK = 'back',
  TRIM = 'trim',
  BODY_COLOR = 'bodyColor',
  INTERIOR_COLOR = 'interiorColor',
  EXTERIOR_COLOR = 'exteriorColor',
  OTHER = 'other',
}

const MediaTypeEnumLabels = {
  [MediaType.MAIN]: 'Main',
  [MediaType.FRONT]: 'Front',
  [MediaType.BACK]: 'Back',
  [MediaType.TRIM]: 'Trim',
  [MediaType.BODY_COLOR]: 'Body Color',
  [MediaType.INTERIOR_COLOR]: 'Interior Color',
  [MediaType.EXTERIOR_COLOR]: 'Exterior Color',
  [MediaType.OTHER]: 'Other',
};

export const toMediaTypeLabel = (mediaType: MediaType) => MediaTypeEnumLabels[mediaType];

export const mediaTypeOptions = Object.values(MediaType).map((value) => ({
  label: toMediaTypeLabel(value),
  value,
}));

export type VehicleVariantMediaDTO = {
  id: string;
  title: string;
  description: string | null;
  url: string;
  file_id: string;
  variant_id: string;
  mime_type: string;
  media_type: MediaType;
  metadata: Record<string, unknown> | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

const MediaSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  url: z.string(),
  file_id: z.string(),
  variant_id: z.string(),
  mime_type: z.string(),
  media_type: z.nativeEnum(MediaType),
  file: z.instanceof(File).optional(),
});

export const VehicleVariantMediaSchema = z.object({
  media: z.array(MediaSchema),
});

export const EditVehicleVariantMediaSchema = z.object({
  title: z.string().min(1, {
    message: 'Title is required',
  }),
  description: z.string().optional(),
  media_type: z.nativeEnum(MediaType, {
    required_error: 'Media type is required',
  }),
});

export type VehicleVariantMediaInput = z.infer<typeof VehicleVariantMediaSchema>;
export type EditVehicleVariantMediaInput = z.infer<typeof EditVehicleVariantMediaSchema>;
export type MediaInput = z.infer<typeof MediaSchema>;
