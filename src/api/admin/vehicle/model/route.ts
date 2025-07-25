import { AuthenticatedMedusaRequest, MedusaRequest, MedusaResponse } from '@medusajs/framework';
import { ContainerRegistrationKeys, remoteQueryObjectFromString } from '@medusajs/utils';
import { VehicleModelInput } from '../../../../modules/vehicle/schemas/model.schemas';
import { createVehicleModelWorkflow } from '../../../../workflows/vehicle/model/create-vehicle-model.workflow';
import { getVehicleModelQuery } from '../data/get-vehicle-model.query';

export async function POST(
  req: AuthenticatedMedusaRequest<VehicleModelInput>,
  res: MedusaResponse,
): Promise<void> {
  try {
    const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY);

    const {
      result: { product },
    } = await createVehicleModelWorkflow(req.scope).run({
      input: req.validatedBody,
    });

    // link variants to trim

    const productsQuery = remoteQueryObjectFromString({
      entryPoint: 'products',
      fields: ['id', 'title', 'thumbnail', 'vehicle_model.id'],
      variables: {
        filters: {
          id: product.id,
        },
      },
    });

    const productData = await remoteQuery(productsQuery);

    const { vehicle_model, ...rest } = productData[0];

    res.status(201).json({
      product: {
        ...rest,
        model: {
          id: vehicle_model.id,
          name: rest.title,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

export async function GET(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const data = await getVehicleModelQuery({ query });

  res.status(200).json(data);
}
