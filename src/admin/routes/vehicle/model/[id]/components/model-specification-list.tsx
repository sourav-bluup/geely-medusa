import { PencilSquare } from '@medusajs/icons';
import { Badge, Container, Table } from '@medusajs/ui';
import { Plus } from 'lucide-react';
import { useMemo } from 'react';
import {
  SpecificationCategoryEnum,
  toSpecificationCategoryLabel,
} from '../../../../../../modules/vehicle/enums/specification-category.enum';
import { VehicleModelDto } from '../../../../../../modules/vehicle/types/vehicle-model.type';
import { ActionMenu, PageHeader } from '../../../../../components/common';
import { useTrimSpecificationGroups } from '../../../../../hooks/api/trim-specifications';

type Props = {
  model: VehicleModelDto;
};

const ModelSpecificationList = ({ model }: Props) => {
  const { groups, isLoading } = useTrimSpecificationGroups(model.id);
  const createdGroupTitles = useMemo(() => groups?.map((group) => group.title) || [], [groups]);

  const uncreatedGroups = useMemo(
    () =>
      Object.values(SpecificationCategoryEnum).filter(
        (category) => !createdGroupTitles.includes(category),
      ),
    [createdGroupTitles],
  );

  const ready = groups && !isLoading;
  return (
    <Container className="divide-y p-0">
      <PageHeader
        title="Model Specifications"
        subtitle="Manage and edit specifications for this model"
        actions={
          uncreatedGroups && uncreatedGroups.length > 0
            ? [
                {
                  actions: uncreatedGroups.map((group) => ({
                    label: `Add ${toSpecificationCategoryLabel(group)} Specifications`,
                    to: `/vehicle/model/${model.id}/specs/create?group=${group}`,
                    icon: <Plus />,
                  })),
                },
              ]
            : undefined
        }
      />
      {ready && (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Group</Table.HeaderCell>
              <Table.HeaderCell>Trims</Table.HeaderCell>
              <Table.HeaderCell>Count</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {groups.map((group) => (
              <Table.Row
                key={group.title}
                className="cursor-pointer [&_td:last-child]:w-[1%] [&_td:last-child]:whitespace-nowrap"
              >
                <Table.Cell>{toSpecificationCategoryLabel(group.title)}</Table.Cell>
                <Table.Cell>
                  <div className="flex flex-wrap gap-2">
                    {group.trims?.split(',').map((trim) => (
                      <Badge size="xsmall" key={trim}>
                        {trim.trim()}
                      </Badge>
                    ))}
                  </div>
                </Table.Cell>
                <Table.Cell>{group.count}</Table.Cell>
                <Table.Cell>
                  <ActionMenu
                    groups={[
                      {
                        actions: [
                          {
                            label: 'Edit',
                            to: `/vehicle/model/${model.id}/specs/edit?group=${group.title}`,
                            icon: <PencilSquare />,
                          },
                        ],
                      },
                    ]}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Container>
  );
};

export default ModelSpecificationList;
