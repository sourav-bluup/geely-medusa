import { Badge, Button, Container, Heading, Text } from '@medusajs/ui';
import { Link, useParams } from 'react-router-dom';
import { cn } from '../../../../../../../modules/vehicle/lib/utils';
import { SingleColumnPage } from '../../../../../../components/layouts/single-column-page';
import { AdminProductVariant, useProductVariants } from '../../../../../../hooks/api/products';
import MediaListSection from '../components/media-list-section';

const VariantPage = () => {
  const { id, variantId } = useParams();

  const data = useProductVariants(id as string, {
    fields: 'title, product.title, sku, id',
  });

  const variants = data?.variants as AdminProductVariant[];

  const ready = variantId && id && variants;

  if (!ready) {
    return <div>Loading...</div>;
  }

  const variant = variants?.find((v) => v.id === variantId);

  return (
    <SingleColumnPage hasOutlet>
      <div className="flex items-center justify-between">
        <Heading level="h2">Vehicle variants</Heading>
        <div>
          <Button size="small" variant="secondary" asChild>
            <Link to={`/products/${id}`}>Back</Link>
          </Button>
        </div>
      </div>
      <div className="grid h-full grid-cols-4 gap-4">
        <Container className="bg-ui-bg-base divide-y p-0">
          {variant && (
            <div className="space-y-4 overflow-hidden text-ellipsis whitespace-nowrap p-4">
              <div className="space-y-1">
                <Heading level="h3">{variant.product?.title}</Heading>
                <Text size="small" className="text-ui-text-muted">
                  {variant.title}
                </Text>
              </div>
              <Badge size="xsmall"> {variants?.length} variant(s)</Badge>
            </div>
          )}
          <div className="flex flex-col divide-y">
            {variants?.map((v) => (
              <Link
                className={cn('hover:bg-ui-bg-base-hover flex flex-col p-4 px-4 leading-none', {
                  'bg-ui-bg-base-hover': v.id === variantId,
                })}
                key={v.id}
                to={`/products/${id}/vehicles/variant/${v.id}`}
              >
                <Text size="small">{v.title}</Text>
                <Text size="xsmall">sku: {v.sku}</Text>
              </Link>
            ))}
          </div>
        </Container>
        <div className="col-span-3">
          <Container className="divide-y p-0">
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <Heading>Media</Heading>
              </div>
              <Link to={`/products/${id}/vehicles/variant/${variantId}/media/create`}>
                <Button size="small" variant="secondary">
                  Add media
                </Button>
              </Link>
            </div>
            <MediaListSection variantId={variantId} />
          </Container>
        </div>
      </div>
    </SingleColumnPage>
  );
};

export default VariantPage;
