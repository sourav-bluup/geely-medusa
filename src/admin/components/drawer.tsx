import { FC, PropsWithChildren } from 'react';
import { Drawer as BaseDrawer } from '@medusajs/ui';

type Props = {
  title: string;
  isOpen: boolean;
  setOpen: () => void;
  close: () => void;
};

const Drawer: FC<PropsWithChildren<Props>> = ({ title, children, isOpen, close }) => {
  const handleCancel = () => {
    close();
  };

  return (
    <BaseDrawer open={isOpen} onOpenChange={handleCancel}>
      <BaseDrawer.Content>
        <BaseDrawer.Header>
          <BaseDrawer.Title>{title}</BaseDrawer.Title>
        </BaseDrawer.Header>
        <BaseDrawer.Body className="p-4">{children}</BaseDrawer.Body>
      </BaseDrawer.Content>
    </BaseDrawer>
  );
};

export default Drawer;
