import { z } from 'zod';
import { InstallmentTermEnum } from '../../../../modules/vehicle/enums/installment.enum';
import { SpecificationCategoryEnum } from '../../../../modules/vehicle/enums/specification-category.enum';
import { UnitEnum } from '../../../../modules/vehicle/enums/unit.enum';

export const LinkModelToProductInput = z
  .object({
    model_id: z.string().min(1, {
      message: 'Model is required',
    }),
    product_id: z.string().min(1, {
      message: 'Product is required',
    }),
    data: z
      .object({
        has_installment: z.boolean().default(false),
        installment_amount: z
          .object({
            float: z.number().optional(),
            value: z.string().optional(),
          })
          .optional(),
        installment_term: z.nativeEnum(InstallmentTermEnum).nullable().optional(),
        installment_description: z.string().nullable().optional(),
        has_test_drive: z.boolean().default(false),
        test_drive_description: z.string().nullable().optional(),
        has_lease: z.boolean().default(false),
        lease_amount: z
          .object({
            float: z.number().optional(),
            value: z.string().optional(),
          })
          .optional(),
        lease_term: z.nativeEnum(InstallmentTermEnum).nullable().optional(),
        lease_description: z.string().nullable().optional(),
      })
      .optional()
      .superRefine((data, ctx) => {
        if (data?.has_installment) {
          if (
            !data.installment_amount ||
            !data.installment_amount.float ||
            data.installment_amount.float <= 0
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Installment amount must be greater than 0 when has_installment is true',
              path: ['installment_amount'],
            });
          }
          if (!data.installment_term) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Installment term is required when has_installment is true',
              path: ['installment_term'],
            });
          }
        }
        if (data?.has_lease) {
          if (!data.lease_amount || !data.lease_amount.float || data.lease_amount.float <= 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Lease amount must be greater than 0 when has_lease is true',
              path: ['lease_amount'],
            });
          }
          if (!data.lease_term) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Lease term is required when has_lease is true',
              path: ['lease_term'],
            });
          }
        }
      }),
  })
  .strict();

export type LinkModelToProductType = z.infer<typeof LinkModelToProductInput>;
export const SpecificationSchema = z.object({
  data: z.object({
    header: z.object({
      group: z.object({
        value: z.nativeEnum(SpecificationCategoryEnum, {
          required_error: 'Category is required',
        }),
      }),
      id: z.string().optional(),
      values: z.array(
        z.object({
          value: z.string().optional(),
        }),
      ),
    }),
    rows: z
      .array(
        z.object({
          group: z.string().optional(),
          type: z.enum(['text', 'boolean', 'number']),
          id: z.string().optional(),
          values: z.array(z.object({ value: z.string(), id: z.string().optional() })),
          is_active: z.boolean(),
          unit: z.nativeEnum(UnitEnum).nullable().optional(),
          order: z.number().optional(),
        }),
      )
      .min(1, {
        message: 'At least one row is required',
      }),
  }),
});
