import type { ComponentProps, ForwardRefRenderFunction } from 'react';
import { forwardRef, useState } from 'react';

// Import SelectProps explicitly
import { Select } from '@medusajs/ui';

type SelectOption = {
  label: string;
  value: string;
};

// Use SelectProps in the Props type definition
type Props = ComponentProps<typeof Select> & {
  options: SelectOption[];
  placeholder?: string;
};

const SelectFieldComponent: ForwardRefRenderFunction<HTMLButtonElement, Props> = (
  { placeholder, options, onValueChange, ...rest },
  ref,
) => {
  const [_, setSelected] = useState<string | undefined>();
  const onChange = (value: string) => {
    setSelected(value);
    onValueChange?.(value);
  };

  return (
    <Select {...rest} onValueChange={onChange}>
      <Select.Trigger ref={ref}>
        <Select.Value placeholder={placeholder} />
      </Select.Trigger>
      <Select.Content>
        {options?.map(({ label, value }) => (
          <Select.Item key={value} value={value}>
            {label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  );
};

const SelectField = forwardRef<HTMLButtonElement, Props>(SelectFieldComponent);

SelectField.displayName = 'SelectField';

export default SelectField;
