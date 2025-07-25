import { Button, Heading } from '@medusajs/ui';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { RouteDrawer } from '../common/modals/route-focus-modal/route-drawer';

type DrawerFormLayoutProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  title: string;
  description?: string;
  isLoading?: boolean;
};

export function DrawerFormLayout<T extends FieldValues>({
  form,
  onSubmit,
  children,
  title,
  description,
  isLoading,
}: DrawerFormLayoutProps<T>) {
  return (
    <>
      <RouteDrawer.Header>
        <Heading>{title}</Heading>
        <RouteDrawer.Description>
          {description ?? 'Edit or create a new item'}
        </RouteDrawer.Description>
      </RouteDrawer.Header>
      <RouteDrawer.Form form={form}>
        <form onSubmit={onSubmit} className="flex flex-1 flex-col overflow-y-auto">
          <RouteDrawer.Body className="">{children}</RouteDrawer.Body>
          <RouteDrawer.Footer>
            <div className="flex items-center justify-end gap-x-2">
              <RouteDrawer.Close asChild>
                <Button size="small" variant="secondary">
                  Cancel
                </Button>
              </RouteDrawer.Close>
              <Button size="small" type="submit" isLoading={isLoading}>
                Save
              </Button>
            </div>
          </RouteDrawer.Footer>
        </form>
      </RouteDrawer.Form>
    </>
  );
}
