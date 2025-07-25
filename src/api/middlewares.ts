import { defineMiddlewares } from '@medusajs/medusa';
import { sanityRoutesMiddlewares } from './admin/sanity/middlewares';
import { adminMakeRoutesMiddlewares } from './admin/vehicle/make/middlewares';
import { modelRoutesMiddlewares } from './admin/vehicle/model/middlewares';
import { vehicleProductRoutesMiddlewares } from './admin/vehicle/product/middlewares';
import { trimRoutesMiddlewares } from './admin/vehicle/trim/middlewares';
import { vehicleVariantRoutesMiddlewares } from './admin/vehicle/variant/middlewares';
import { storeMiddlewares } from './store/middlewares';

export default defineMiddlewares({
  routes: [
    ...modelRoutesMiddlewares,
    ...trimRoutesMiddlewares,
    ...vehicleProductRoutesMiddlewares,
    ...vehicleVariantRoutesMiddlewares,
    ...adminMakeRoutesMiddlewares,
    ...storeMiddlewares,
    ...sanityRoutesMiddlewares,
  ],
});
