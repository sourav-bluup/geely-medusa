import { clx, Text } from '@medusajs/ui';
import { ReactNode } from 'react';

export type SectionRowProps = {
  title: string;
  value?: ReactNode | string | null;
  actions?: ReactNode;
  compact?: boolean;
};

export const SectionRow = ({ title, value, actions, compact = false }: SectionRowProps) => {
  const isValueString = typeof value === 'string' || !value;

  return (
    <div
      className={clx(`text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4`, {
        'grid-cols-[1fr_1fr_auto]': !!actions,
        'px-4 py-2': compact,
      })}
    >
      <Text size="small" weight="plus" leading="compact">
        {title}
      </Text>

      {isValueString ? (
        <Text size="small" leading="compact" className="whitespace-pre-line text-pretty">
          {value ?? '-'}
        </Text>
      ) : (
        <div className="flex flex-wrap gap-1">{value}</div>
      )}

      {actions && <div>{actions}</div>}
    </div>
  );
};
