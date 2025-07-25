import { RemoteQueryEntryPointsTypes } from '.medusa/types';
import { variantTransformer } from './variant-transformer';
import { vehicleModelLinkTransformer } from './vehicle-model-link-transformer';
import { vehicleModelTransformer } from './vehicle-model-transformer';

export const productTransformer = (product: RemoteQueryEntryPointsTypes.Product) => {
  {
    const variants = product.variants.map(variantTransformer);

    const model = vehicleModelTransformer(product.vehicle_model, product.categories);

    const firstVariant = variants[0];

    const subTitle = [
      firstVariant?.trim?.year || model?.year,
      model?.transmission,
      model?.fuelType,
      firstVariant?.trim?.mileage && `${firstVariant.trim.mileage} km`,
      firstVariant?.title,
    ]
      .filter(Boolean)
      .join(', ');

    return {
      id: product.id,
      title: product.title,
      handle: product.handle,
      subtitle: product.subtitle || subTitle,
      description: product.description,
      thumbnail: product.thumbnail,
      images: product.images,
      quantity: variants.reduce((acc, variant) => acc + variant.inventoryQuantity, 0),
      collection: {
        id: product.collection.id,
        title: product.collection.title,
        handle: product.collection.handle,
      },
      type: {
        id: product.type.id,
        title: product.type.value,
      },
      options: product.options.map((option) => ({
        id: option.id,
        title: option.title,
        values: option.values.map((value) => ({
          id: value.id,
          title: value.value,
          optionId: value.option_id,
        })),
      })),
      ...vehicleModelLinkTransformer(product.vehicle_model_link),
      model,
      variants,
    };
  }
};
