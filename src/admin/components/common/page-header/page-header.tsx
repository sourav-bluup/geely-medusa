import { Heading, Text } from '@medusajs/ui';
import { ActionGroup, ActionMenu } from '../action-menu';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ActionGroup[];
}

export const PageHeader = ({ title, subtitle, actions }: PageHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div>
        <Heading>{title}</Heading>
        {subtitle && (
          <Text className="text-ui-fg-subtle" size="small">
            {subtitle}
          </Text>
        )}
      </div>
      {actions && actions.length > 0 && (
        <div className="flex items-center gap-x-2">
          <ActionMenu groups={actions} />
        </div>
      )}
    </div>
  );
};
