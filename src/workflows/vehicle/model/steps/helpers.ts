import { IProductModuleService } from '@medusajs/framework/types';
import { Modules } from '@medusajs/framework/utils';
import { MedusaContainer } from '@medusajs/medusa';

const VEHICLE_TYPE_TITLE = 'Vehicle';
const getModelProductTypeId = async (container: MedusaContainer) => {
  const productModuleService: IProductModuleService = container.resolve(Modules.PRODUCT);

  const productType = await productModuleService.listProductTypes(
    { value: VEHICLE_TYPE_TITLE },
    { take: 1 },
  );

  if (productType.length) {
    return productType[0].id;
  }

  const newType = await productModuleService.createProductTypes([{ value: VEHICLE_TYPE_TITLE }]);

  return newType[0].id;
};

const createOrGetCollectionId = async (container: MedusaContainer, name: string) => {
  const productService: IProductModuleService = container.resolve(Modules.PRODUCT);

  const existingCollections = await productService.listProductCollections(
    { title: name },
    { take: 1 },
  );

  let collectionId: string;

  if (existingCollections.length === 0) {
    const [newCollection] = await productService.createProductCollections([
      {
        title: name,
      },
    ]);
    collectionId = newCollection.id;
  } else {
    collectionId = existingCollections[0].id;
  }
  return collectionId;
};

export { createOrGetCollectionId, getModelProductTypeId };
