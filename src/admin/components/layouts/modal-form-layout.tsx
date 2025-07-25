import { Button } from '@medusajs/ui';
import { UseFormReturn } from 'react-hook-form';
import { RouteFocusModal } from '../common/modals/route-focus-modal';

type ModalFormLayoutProps = {
  form: UseFormReturn<any>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  title: string;
  description?: string;
};

export const ModalFormLayout = ({ form, onSubmit, children }: ModalFormLayoutProps) => {
  return (
    <RouteFocusModal.Form form={form}>
      <form onSubmit={onSubmit} className="flex flex-1 flex-col overflow-y-auto">
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                Cancel
              </Button>
            </RouteFocusModal.Close>
            <Button size="small" variant="primary" type="submit" isLoading={false}>
              Save
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="p-16">
          <div className="flex w-full flex-col gap-y-8">{children}</div>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  );
};
