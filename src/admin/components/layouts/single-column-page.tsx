import { Outlet } from 'react-router-dom';
import { PropsWithChildren } from 'react';

type PageProps = {
  hasOutlet?: boolean;
};

export const SingleColumnPage = ({ children, hasOutlet }: PropsWithChildren<PageProps>) => {
  return (
    <div className="flex flex-col gap-y-3">
      {children}

      {hasOutlet && <Outlet />}
    </div>
  );
};
