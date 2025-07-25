import { Input, Tabs, Tooltip } from '@medusajs/ui';
import { FC, useEffect, useState } from 'react';
import { ControllerRenderProps, useFormContext } from 'react-hook-form';

export type TabInputItem = {
  id: string;
  name: string;
  tooltip?: string;
  placeholder?: string;
};

type TabInputProps = {
  items?: Array<TabInputItem>;
  field: ControllerRenderProps<any, string>;
};

export const TabInput: FC<TabInputProps> = ({ items, field }) => {
  const [uncontrolledValues, setUncontrolledValues] = useState<
    Array<{ id: string; value: string }>
  >([]);

  const { trigger } = useFormContext();

  useEffect(() => {
    if (Array.isArray(field.value)) {
      setUncontrolledValues(field.value);
      field.onBlur();
    }
  }, [field.value]);

  const updateValues = (id: string, value: string, index: number) => {
    const newValues = [...uncontrolledValues];
    newValues[index] = { id, value };
    setUncontrolledValues(newValues);
    field.onChange(newValues);
    field.onBlur();
    trigger('variants');
  };

  return (
    <Tabs defaultValue={items?.[0]?.id}>
      <Tabs.List className="mb-1 flex-wrap">
        {items?.map((item) => (
          <Tabs.Trigger
            key={item.id}
            value={item.id}
            className="data-[state=active]:!text-ui-fg-interactive rounded-none !bg-transparent p-0 text-[0.7rem] !shadow-none"
          >
            <Tooltip content={item.tooltip}>
              <span className="flex items-center gap-1">{item.name}</span>
            </Tooltip>
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {items?.map((item, index) => (
        <Tabs.Content key={index} value={item.id}>
          <Input
            type="number"
            placeholder={item.placeholder}
            size="small"
            className="w-40"
            onChange={(e) => updateValues(item.id, e.target.value, index)}
            onBlur={(e) => updateValues(item.id, e.target.value, index)}
            value={uncontrolledValues[index]?.value || ''}
          />
        </Tabs.Content>
      ))}
    </Tabs>
  );
};
