import { clx } from '@medusajs/ui';
import { Children, ComponentPropsWithoutRef } from 'react';
import { Outlet } from 'react-router-dom';

type PageProps = {
  hasOutlet?: boolean;
  children: React.ReactNode;
};
const Root = ({ children, hasOutlet = true }: PageProps) => {
  const childrenArray = Children.toArray(children);

  if (childrenArray.length !== 2) {
    throw new Error('TwoColumnPage expects exactly two children');
  }

  const [main, sidebar] = childrenArray;

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex flex-col gap-x-4 gap-y-3 xl:flex-row xl:items-start">
        <div className="flex w-full flex-col gap-y-3">{main}</div>
        <div className="flex w-full max-w-[100%] flex-col gap-y-3 xl:mt-0 xl:max-w-[440px]">
          {sidebar}
        </div>
      </div>
      {hasOutlet && <Outlet />}
    </div>
  );
};

const Main = ({ children, className, ...props }: ComponentPropsWithoutRef<'div'>) => {
  return (
    <div className={clx('flex w-full flex-col gap-y-3', className)} {...props}>
      {children}
    </div>
  );
};

const Sidebar = ({ children, className, ...props }: ComponentPropsWithoutRef<'div'>) => {
  return (
    <div
      className={clx(
        'flex w-full max-w-[100%] flex-col gap-y-3 xl:mt-0 xl:max-w-[440px]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const TwoColumnPage = Object.assign(Root, { Main, Sidebar });
