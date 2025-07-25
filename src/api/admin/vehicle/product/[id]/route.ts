import { AuthenticatedMedusaRequest, MedusaRequest, MedusaResponse } from '@medusajs/framework';
import { ContainerRegistrationKeys, MedusaError, Modules } from '@medusajs/utils';
import productVehicleModel from '../../../../../links/product-vehicle-model';
import { VEHICLE_MODULE } from '../../../../../modules/vehicle';
import { LinkModelToProductType } from '../../model/validators';
import { Link } from '@medusajs/framework/modules-sdk';

type VehicleModel = { vehicle_model_id: string; product_id: string };

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const id = req.params.id;
  if (!id) {
    return MedusaError.Types.INVALID_DATA;
  }
  try {
    const {
      data: [model],
    } = await query.graph({
      entity: productVehicleModel.entryPoint,
      fields: req.queryConfig.fields,
      filters: {
        product_id: id,
      },
    });
    return res.status(200).json({
      product_model: model,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export async function POST(
  req: AuthenticatedMedusaRequest<LinkModelToProductType>,
  res: MedusaResponse,
): Promise<void> {
  try {
    const remoteLink = req.scope.resolve<Link>(ContainerRegistrationKeys.LINK);
    const { product_id, model_id, data, ...rest } = req.validatedBody;
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

    // Normalize amounts
    const normalizedData = {
      ...data,
      installment_amount: data.has_installment ? Number(data.installment_amount?.float) : null,
      installment_term: data.has_installment ? data.installment_term : null,
      installment_description: data.has_installment ? data.installment_description : null,
      test_drive_description: data.has_test_drive ? data.test_drive_description : null,
      lease_amount: data.has_lease ? Number(data.lease_amount?.float) : null,
      lease_term: data.has_lease ? data.lease_term : null,
      lease_description: data.has_lease ? data.lease_description : null,
    };

    const [updatedLink] = (await remoteLink.create({
      [VEHICLE_MODULE]: {
        vehicle_model_id: model_id,
      },
      [Modules.PRODUCT]: {
        product_id,
      },
      data: normalizedData,
    })) as VehicleModel[];

    res.status(200).json({
      product_model: {
        vehicle_model_id: updatedLink?.vehicle_model_id,
        product_id,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
