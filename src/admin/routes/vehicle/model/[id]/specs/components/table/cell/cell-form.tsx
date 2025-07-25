import { useFormContext } from 'react-hook-form';
import { Form } from '../../../../../../../../components/common';
import SelectField from '../../../../../../../../components/ui/select';

type CellFormWrapperProps = {
  name: string;
  options: { value: string; label: string }[];
};
const CellSelect = ({ name, options }: CellFormWrapperProps) => {
  const { control } = useFormContext();
  return (
    <Form.Field
      control={control}
      name={name}
      render={({ field }) => (
        <Form.Item>
          <Form.Control>
            <SelectField
              size="small"
              {...field}
              value={field?.value?.value}
              onValueChange={(value: string) => {
                field.onChange({ ...field.value, value });
              }}
              placeholder="Select Value"
              options={options}
            />
          </Form.Control>
          <Form.ErrorMessage />
        </Form.Item>
      )}
    />
  );
};

export { CellSelect };
