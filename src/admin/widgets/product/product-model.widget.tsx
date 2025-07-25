import { defineWidgetConfig } from '@medusajs/admin-sdk';
import { Pencil, Plus } from '@medusajs/icons';
import { AdminProduct, DetailWidgetProps } from '@medusajs/types';
import { Button, Container, Heading, Table, Text, toast } from '@medusajs/ui';
import { CarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ActionMenu } from '../../components/common';
import { useProductModel } from '../../hooks/api/products';
import { useSanitySync } from '../../hooks/api/sanity';
import { useGetProductTrimVariants } from '../../hooks/use-product/use-product';
import ModelInfoSection from './components/model-info-section';
import VariantActions from './components/variant-actions';
const ProductModelWidget = ({ data }: DetailWidgetProps<AdminProduct>) => {
  const { productModel: model } = useProductModel(data.id);
  const { data: variants } = useGetProductTrimVariants(data.id);

  const hasModel = !!model;

  if (!['Vehicle', 'Vehicles'].includes(data?.type?.value || '')) {
    return null;
  }

  const { mutate: revalidate, isPending, error } = useSanitySync();

  const handleRevalidate = () => {
    revalidate(
      { product_id: data.id },
      { onSuccess: () => toast.success('Revalidation successful') },
    );
  };

  return (
    <>
      <Container>
        {error && <Text>{error.message}</Text>}
        <Button onClick={handleRevalidate} isLoading={isPending}>
          Revalidate storefront
        </Button>
      </Container>
      <Container className="divide-y overflow-hidden rounded-lg p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2" className="flex items-center gap-2">
            {model?.vehicle_model?.title && (
              <>
                <CarIcon /> {model.vehicle_model.title}
              </>
            )}
          </Heading>
          <ActionMenu
            groups={[
              {
                actions: [
                  ...(hasModel
                    ? [
                        {
                          icon: <Pencil />,
                          label: 'Edit',
                          to: `vehicles/model/${data.id}/edit`,
                        },
                      ]
                    : []),
                  ...(!hasModel
                    ? [
                        {
                          icon: <Plus />,
                          label: 'Attach Model',
                          to: `vehicles/model/attach`,
                        },
                      ]
                    : []),
                ],
              },
            ]}
          />
        </div>
        <ModelInfoSection
          enabled={model?.has_installment}
          title="Installment"
          description={model?.installment_description}
          amount={model?.installment_amount}
          term={model?.installment_term}
        />
        <ModelInfoSection
          enabled={model?.has_lease}
          title="Lease"
          description={model?.lease_description}
          amount={model?.lease_amount}
          term={model?.lease_term}
        />
        <ModelInfoSection
          enabled={model?.has_test_drive}
          title="Test Drive"
          description={model?.test_drive_description}
        />
      </Container>
      <Container className="divide-y overflow-hidden rounded-lg p-0">
        {model?.vehicle_model_id && (
          <div className="flex items-center justify-between px-6 py-4">
            <Text weight="plus" size="small">
              Trims
            </Text>
          </div>
        )}
        <div className="bg-medusa-bg-subtle flex items-center justify-between px-6 py-4">
          <div>
            <Heading level="h3" className="text-medusa-fg-base font-medium">
              Product Trims
            </Heading>
            <Text size="xsmall" className="text-ui-fg-subtle">
              {variants?.length || 0} trims linked to product variations
            </Text>
          </div>
          {variants?.[0]?.id && (
            <Button
              asChild
              size="small"
              variant="secondary"
              className="bg-medusa-button-neutral hover:bg-medusa-button-neutral-hover text-medusa-fg-base"
            >
              <Link to={`vehicles/variant/${variants?.[0]?.id}`}>Manage images</Link>
            </Button>
          )}
        </div>
        {hasModel && (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Variant</Table.HeaderCell>
                <Table.HeaderCell>Trim</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {variants?.map((variant) => (
                <Table.Row
                  className="cursor-pointer [&_td:last-child]:w-[1%] [&_td:last-child]:whitespace-nowrap"
                  key={variant.id}
                >
                  <Table.Cell>{variant.title || ' - '}</Table.Cell>
                  <Table.Cell>{variant.vehicle_trim?.title || ' - '}</Table.Cell>
                  <Table.Cell>
                    <VariantActions variant={variant} modelId={model?.vehicle_model_id} />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </Container>
    </>
  );
};

export const config = defineWidgetConfig({
  zone: 'product.details.side.before',
});

export default ProductModelWidget;
