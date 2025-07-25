import { FC } from 'react';
import { ChipInput } from '../../../../../components/inputs/chip-input';
import Field from '../../../../../components/ui/field';

export const ColorInputs: FC = () => (
  <div className="grid grid-cols-2 gap-4">
    <Field name={`bodyColor`} required label="Body Color">
      {(field) => <ChipInput placeholder="Use comma to separate values" {...field} />}
    </Field>
    <Field name={`interiorColor`} required label="Interior Color">
      {(field) => <ChipInput placeholder="Use comma to separate values" {...field} />}
    </Field>
  </div>
);
