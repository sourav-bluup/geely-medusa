import { PencilSquare, Plus, Trash } from '@medusajs/icons';
import { Container, Heading, Table, usePrompt } from '@medusajs/ui';
import { FC } from 'react';
import { VehicleModelDto } from '../../../../../../modules/vehicle/types/vehicle-model.type';
import { VehicleTrimDto } from '../../../../../../modules/vehicle/types/vehicle-trim.type';
import { ActionMenu } from '../../../../../components/common';
import { useModelTrims } from '../../../../../hooks/api/models';
import { useDeleteTrim } from '../../../../../hooks/api/trim';

type Props = {
  model: VehicleModelDto;
};

type TrimActionProps = {
  trim: VehicleTrimDto;
};

const TrimAction: FC<TrimActionProps> = ({ trim }) => {
  const prompt = usePrompt();

  const { mutateAsync } = useDeleteTrim();

  const handleDelete = async () => {
    const res = await prompt({
      title: 'Delete Trim',
      description: `Are you sure you want to delete this trim?`,
    });

    if (!res) {
      return;
    }

    await mutateAsync(trim.id);
  };

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              label: 'Edit',
              to: `trim/${trim.id}/edit`,
              icon: <PencilSquare />,
            },
          ],
        },
        {
          actions: [{ label: 'Delete', onClick: handleDelete, icon: <Trash /> }],
        },
      ]}
    />
  );
};

const ModelTrimList: FC<Props> = ({ model }) => {
  const { trims } = useModelTrims(model.id);

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>Trims</Heading>
        <div className="flex items-center gap-x-4">
          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    label: 'Add Trim',
                    to: 'trim/create',
                    icon: <Plus />,
                  },
                ],
              },
            ]}
          />
        </div>
      </div>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Handle</Table.HeaderCell>
            <Table.HeaderCell>Sort Rank</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {trims && trims?.length > 0 && (
          <Table.Body>
            {trims?.map((trim) => (
              <Table.Row
                key={trim.id}
                className="[&_td:last-child]:w-[1%] [&_td:last-child]:whitespace-nowrap"
              >
                <Table.Cell>{trim.title}</Table.Cell>
                <Table.Cell>{trim.handle}</Table.Cell>
                <Table.Cell>{trim.sort_rank}</Table.Cell>
                <Table.Cell>
                  <TrimAction trim={trim} />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        )}
      </Table>
    </Container>
  );
};

export default ModelTrimList;
