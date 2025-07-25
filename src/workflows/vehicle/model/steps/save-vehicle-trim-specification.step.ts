import { createStep, StepResponse } from '@medusajs/framework/workflows-sdk';
import { SpecificationInput } from '../../../../admin/routes/vehicle/model/[id]/specs/components/table/types';
import { VEHICLE_MODULE } from '../../../../modules/vehicle';
import VehicleModuleService from '../../../../modules/vehicle/service';

type StepInput = {
  data: SpecificationInput['data'];
  model_id: string;
};

const saveVehicleTrimSpecificationStepId = 'save-vehicle-trim-specification-step';

const saveVehicleTrimSpecificationStep = createStep(
  saveVehicleTrimSpecificationStepId,
  async ({ model_id, data }: StepInput, { container }) => {
    const vehicleModuleService: VehicleModuleService = container.resolve(VEHICLE_MODULE);

    const { header, rows } = data;

    const createData = [];
    const updateData = [];

    header.values.forEach((h, valueIndex) => {
      rows.forEach((row) => {
        const obj = {
          trim_id: h.value,
          model_id,
          value: row.values[valueIndex].value,
          group: header.group.value,
          group_value: row.group,
          type: row.type,
          is_active: row.is_active,
          unit: row.unit || null,
          order: row.order,
        };

        if (row.values[valueIndex].id && Boolean(row.values[valueIndex].value)) {
          updateData.push({ ...obj, id: row.values[valueIndex].id });
        } else if (Boolean(row.values[valueIndex].value)) {
          createData.push(obj);
        }
      });
    });

    const created = await vehicleModuleService.createVehicleTrimSpecifications(createData);
    const updated = await vehicleModuleService.updateVehicleTrimSpecifications(updateData);

    const combined = [...created, ...updated];

    return new StepResponse(combined, {
      createdIds: created.map((item) => item.id),
      updatedIds: updated.map((item) => item.id),
    });
  },
  async ({ createdIds }, { container }) => {
    const vehicleModuleService: VehicleModuleService = container.resolve(VEHICLE_MODULE);
    vehicleModuleService.deleteVehicleTrimSpecifications(createdIds);
  },
);

export { saveVehicleTrimSpecificationStep, saveVehicleTrimSpecificationStepId };
