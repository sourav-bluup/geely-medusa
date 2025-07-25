import { Text, clx } from '@medusajs/ui';
import { ComponentProps, ElementRef, forwardRef } from 'react';
import Primitive from 'react-currency-input-field';

export interface PercentageInputProps extends ComponentProps<typeof Primitive> {
  prefix?: string;
}

export const PercentageInput = forwardRef<ElementRef<'input'>, PercentageInputProps>(
  ({ min = 0, decimalScale = 2, className, prefix = '%', ...props }, ref) => {
    return (
      <div className="relative">
        <Primitive
          ref={ref as any} // dependency is typed incorrectly
          min={min}
          autoComplete="off"
          decimalScale={decimalScale}
          decimalsLimit={decimalScale}
          {...props}
          className={clx(
            'caret-ui-fg-base bg-ui-bg-field shadow-buttons-neutral transition-fg txt-compact-small flex w-full select-none appearance-none items-center justify-between rounded-md px-2 py-1.5 pr-10 text-right outline-none',
            'placeholder:text-ui-fg-muted text-ui-fg-base',
            'hover:bg-ui-bg-field-hover',
            'focus-visible:shadow-borders-interactive-with-active data-[state=open]:!shadow-borders-interactive-with-active',
            'aria-[invalid=true]:border-ui-border-error aria-[invalid=true]:shadow-borders-error',
            'invalid::border-ui-border-error invalid:shadow-borders-error',
            'disabled:!bg-ui-bg-disabled disabled:!text-ui-fg-disabled',
            className,
          )}
        />
        <div className="absolute inset-y-0 right-0 z-10 flex w-8 items-center justify-center border-l">
          <Text className="text-ui-fg-muted" size="small" leading="compact" weight="plus">
            {prefix}
          </Text>
        </div>
      </div>
    );
  },
);
PercentageInput.displayName = 'PercentageInput';
