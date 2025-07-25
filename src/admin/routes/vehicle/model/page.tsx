import { defineRouteConfig } from '@medusajs/admin-sdk';
import { Button, Container, Heading, Table } from '@medusajs/ui';
import { Link, useNavigate } from 'react-router-dom';
import { useVehicleModels } from '../../../hooks/use-vehicle-model';

const VehicleModelPage = () => {
  const { data } = useVehicleModels();
  const navigate = useNavigate();
  const handleEdit = (id: string) => {
    navigate(`/vehicle/model/${id}`);
  };

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading>Vehicle Models</Heading>
        </div>
        <Link to={'/vehicle/model/create'}>
          <Button size="small" variant="secondary">
            Create
          </Button>
        </Link>
      </div>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Handle</Table.HeaderCell>
            <Table.HeaderCell>Trims</Table.HeaderCell>
            <Table.HeaderCell>Make</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {data && data?.length > 0 && (
          <Table.Body>
            {data.map((item) => (
              <Table.Row
                onClick={() => handleEdit(item.id)}
                key={item.id}
                className="cursor-pointer [&_td:last-child]:w-[1%] [&_td:last-child]:whitespace-nowrap"
              >
                <Table.Cell>{item.title}</Table.Cell>
                <Table.Cell>{item.handle}</Table.Cell>
                <Table.Cell>{item.trims?.length} Trims</Table.Cell>
                <Table.Cell>{item.make?.name}</Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        )}
      </Table>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: 'Vehicle Model',
});

export default VehicleModelPage;
