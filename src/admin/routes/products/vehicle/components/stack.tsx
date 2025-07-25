import { Tooltip } from '@medusajs/ui';
import { FC } from 'react';
import { cn } from '../../../../../modules/vehicle/lib/utils';

type StackRingLabel = {
  id: string;
  name: string;
};
type AllColorLabels = {
  bodyColor: Array<StackRingLabel>;
  interiorColor: Array<StackRingLabel>;
};

const StackRing: FC<{
  label: StackRingLabel;
  className?: string;
}> = ({ label, className }) => {
  return (
    <Tooltip content={label.name}>
      <div
        className={cn(
          'bg-ui-bg-switch-off ring-ui-bg-switch-off-hover relative flex size-5 cursor-default items-center justify-center rounded-full py-1 text-[0.6rem] leading-none ring-1',
          className,
        )}
      >
        <span>{label.id}</span>
      </div>
    </Tooltip>
  );
};

const StackBadge: FC<{ label: string; className?: string }> = ({ label, className }) => {
  return (
    <div
      className={cn(
        'dark:bg-ui-bg-highlight bg-ui-bg-interactive text-ui-fg-on-color mr-3 rounded-md px-1 py-0.5 text-[0.6rem]',
        className,
      )}
    >
      {label}
    </div>
  );
};
const ColorStack: FC<{
  label: string;
  colors: StackRingLabel[];
  slice?: number;
}> = ({ label, colors, slice = 2 }) => (
  <span className="flex flex-row items-center gap-2 -space-x-3.5">
    <StackBadge label={label} />
    {colors.slice(0, slice).map((color, index) => (
      <StackRing key={index} label={color} />
    ))}
    {colors.length > slice && (
      <StackRing
        className="ring-ui-border-interactive bg-ui-bg-interactive dark:bg-ui-bg-interactive-dark"
        label={{
          id: `+${colors.length - slice}`,
          name: colors
            .slice(slice)
            .map((color) => color.name)
            .join(', '),
        }}
      />
    )}
  </span>
);

const StackedLabels: FC<{ labels: AllColorLabels; className?: string }> = ({
  labels,
  className,
}) => {
  return (
    <div className={cn('stacked-lables flex flex-row gap-4', className)}>
      {labels.bodyColor && labels.bodyColor.length > 0 && (
        <ColorStack label="Body" colors={labels.bodyColor} />
      )}
      {labels.interiorColor && labels.interiorColor.length > 0 && (
        <ColorStack label="Interior" colors={labels.interiorColor} />
      )}
    </div>
  );
};

export { StackBadge, StackedLabels, StackRing, type AllColorLabels };
