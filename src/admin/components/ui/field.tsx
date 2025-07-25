import type { FC, ReactNode } from 'react';
import type { ControllerRenderProps } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import { Form } from '../common/form';

type FieldProps = {
  name: string;
  label?: string;
  description?: string;
  children: (field: ControllerRenderProps) => ReactNode;
  className?: string;
  required?: boolean;
  showError?: boolean;
};

const Field: FC<FieldProps> = ({
  name,
  children,
  required,
  className,
  label,
  description,
  showError = true,
}) => {
  const { control } = useFormContext();

  return (
    <Form.Field
      control={control}
      name={name}
      render={({ field }) => (
        <Form.Item className={className}>
          {label && (
            <Form.Label>
              <span>{label}</span>
              {required && <span className="text-">*</span>}
            </Form.Label>
          )}
          <Form.Control>{children(field)}</Form.Control>
          {description && <Form.Hint>{description}</Form.Hint>}
          {showError && <Form.ErrorMessage />}
        </Form.Item>
      )}
    />
  );
};

export default Field;
