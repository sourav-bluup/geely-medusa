import { PencilSquare, Trash } from '@medusajs/icons';
import { Container, Heading } from '@medusajs/ui';
import { FC } from 'react';
import { VehicleModelDto } from '../../../../../../modules/vehicle/types/vehicle-model.type';
import { ActionMenu } from '../../../../../components/common';
import { SectionRow } from '../../../../../components/common/section';

type Props = {
  model: VehicleModelDto;
};

const ModelDetailsSection: FC<Props> = ({ model }) => {
  const handleDelete = async () => {};

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{model.title}</Heading>
        <div className="flex items-center gap-x-4">
          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    label: 'Edit',
                    to: 'edit',
                    icon: <PencilSquare />,
                  },
                ],
              },
              {
                actions: [
                  {
                    label: 'Delete',
                    onClick: handleDelete,
                    icon: <Trash />,
                  },
                ],
              },
            ]}
          />
        </div>
      </div>
      <SectionRow title="Handle" value={model?.handle} />
      <SectionRow title="Make" value={model.make?.name} />
      <SectionRow title="Year" value={model.year_category?.name} />
      <SectionRow title="Engine" value={model.engine_category?.name} />
      <SectionRow title="Transmission" value={model.transmission_category?.name} />
      <SectionRow title="Body type" value={model.body_type_category?.name} />
      <SectionRow title="Fuel type" value={model.fuel_type_category?.name} />
      <SectionRow title="Drive type" value={model.drive_type_category?.name} />
      <SectionRow title="Door count" value={model.door_count} />
      <SectionRow title="Seat count" value={model.seat_count} />
    </Container>
  );
};

export default ModelDetailsSection;
