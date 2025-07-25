import { defineRouteConfig } from '@medusajs/admin-sdk';
import { PencilSquare, Trash } from '@medusajs/icons';
import { Button, Container, Heading, Table, usePrompt } from '@medusajs/ui';
import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { VehicleMakeDto } from '../../../../modules/vehicle/types/vehicle-make.type';
import { ActionMenu } from '../../../components/common';
import { useDeleteVehicleMake, useVehicleMakeList } from '../../../hooks/api/make';

type MakeActionProps = {
  make: VehicleMakeDto;
};

const MakeAction: FC<MakeActionProps> = ({ make }) => {
  const prompt = usePrompt();

  const { mutateAsync } = useDeleteVehicleMake(make.id);

  const handleDelete = async () => {
    const res = await prompt({
      title: 'Delete Make',
      description: `Are you sure you want to delete ${make.name}?`,
    });

    if (!res) {
      return;
    }

    await mutateAsync();
  };

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              label: 'Edit',
              to: `${make.id}/edit`,
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
  );
};

const VehicleMakePage = () => {
  const { makes } = useVehicleMakeList();
  const navigate = useNavigate();

  return (
    <Container className="flex flex-col overflow-hidden p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading>Vehicle Makes</Heading>
        </div>
        <Link to={'/vehicle/make/create'}>
          <Button size="small" variant="secondary">
            Create
          </Button>
        </Link>
      </div>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {makes && makes?.length > 0 && (
          <Table.Body>
            {makes.map((make) => (
              <Table.Row
                onClick={() => {
                  navigate(`/vehicle/make/${make.id}/edit`);
                }}
                key={make.id}
                className="[&_td:last-child]:w-[1%] [&_td:last-child]:whitespace-nowrap"
              >
                <Table.Cell>{make.name}</Table.Cell>
                <Table.Cell>
                  <MakeAction make={make} />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        )}
      </Table>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: 'Vehicle Make',
});

export default VehicleMakePage;
