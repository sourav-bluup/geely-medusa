import { z } from 'zod';
import { SpecificationSchema } from '../../../../../../../../api/admin/vehicle/model/validators';

type SpecificationInput = z.infer<typeof SpecificationSchema>;

type TableRow = SpecificationInput['data']['rows'][number];

export type { SpecificationInput, TableRow };
