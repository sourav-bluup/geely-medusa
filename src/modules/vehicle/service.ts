import { Context } from '@medusajs/framework/types';
import { MedusaService } from '@medusajs/utils';
import VehicleMake from './models/vehicle-make';
import VehicleModel from './models/vehicle-model';
import VehicleTrim from './models/vehicle-trim';
import VehicleTrimSpecification from './models/vehicle-trim-specification';
import VehicleVariantMedia from './models/vehicle-variant-media';
import { ModelRepository } from './repositories/model';
import { GetProductIdsFromYearParams, ProductRepository } from './repositories/product';

type InjectedDependencies = {
  productRepository: ProductRepository;
  modelRepository: ModelRepository;
};

class VehicleModuleService extends MedusaService({
  VehicleMake,
  VehicleModel,
  VehicleTrim,
  VehicleVariantMedia,
  VehicleTrimSpecification,
}) {
  protected readonly productRepository_: ProductRepository;
  protected readonly modelRepository_: ModelRepository;

  constructor({ productRepository, modelRepository: modelRepository }: InjectedDependencies) {
    super(...arguments);

    this.productRepository_ = productRepository;
    this.modelRepository_ = modelRepository;
  }

  async listProductTrimOptions(productId: string, context = {}) {
    return this.productRepository_.getProductTrimOptions(productId, context);
  }

  async getProductIdsFromYear(params: GetProductIdsFromYearParams) {
    return this.productRepository_.getProductIdsFromYear(params);
  }

  async getModelSpecificationsByModelId(params: {
    modelId: string;
    group?: string;
    trim_id?: string | string[];
    context?: Context;
  }) {
    return this.modelRepository_.getSpecificationsById(params);
  }

  async filterCategoriesByCollection(
    collectionHandle: string,
    parentCategoryId: string,
    context = {},
  ) {
    return this.productRepository_.filterCategoriesByCollection(
      collectionHandle,
      parentCategoryId,
      context,
    );
  }

  async getModelSpecificationGroups(modelId: string, context = {}) {
    return this.modelRepository_.getSpecificationGroups(modelId, context);
  }
}

export default VehicleModuleService;
