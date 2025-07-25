import { InformationCircleSolid } from '@medusajs/icons';
import { Badge, Text, Tooltip } from '@medusajs/ui';
import { InstallmentTermEnum, toInstallmentTermLabel } from '../../../../modules/vehicle/enums';
import { SectionRow } from '../../../components/common/section';
import { titleToId } from '../../../routes/products/vehicle/utils/title-to-id';
type ModelInfoSectionProps = {
  enabled?: boolean;
  title: string;
  description?: string;
  amount?: number | string;
  term?: InstallmentTermEnum;
};

const ModelInfoSection = ({ title, description, amount, term, enabled }: ModelInfoSectionProps) => (
  <SectionRow
    title={title}
    compact
    value={
      enabled ? (
        <div className="w-full space-y-1">
          {
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {amount && <Text size="xsmall">{amount} AED</Text>}
                {term && (
                  <Tooltip content={toInstallmentTermLabel(term)}>
                    <Badge size="xsmall">{titleToId(term)}</Badge>
                  </Tooltip>
                )}
                {description &&
                  (Boolean(amount) || Boolean(term) ? (
                    <Tooltip content={description}>
                      <InformationCircleSolid className="size-4" />
                    </Tooltip>
                  ) : (
                    <Text size="xsmall">{description}</Text>
                  ))}
              </div>
            </div>
          }
        </div>
      ) : null
    }
  />
);

export default ModelInfoSection;
