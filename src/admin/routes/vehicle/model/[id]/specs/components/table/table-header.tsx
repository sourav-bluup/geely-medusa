import { Table } from '@medusajs/ui';
import { HeaderGroup } from '@tanstack/react-table';
import { TableRow } from './types';

type TableHeaderProps = {
  headerGroups: HeaderGroup<TableRow>[];
};

export const TableHeader = ({ headerGroups }: TableHeaderProps) => (
  <Table.Header>
    {headerGroups.map((headerGroup) => (
      <Table.Row key={headerGroup.id}>
        {headerGroup.headers.map((header) => (
          <Table.HeaderCell key={header.id}>
            {header.isPlaceholder
              ? null
              : typeof header.column.columnDef.header === 'function'
                ? header.column.columnDef.header(header.getContext())
                : header.column.columnDef.header}
          </Table.HeaderCell>
        ))}
      </Table.Row>
    ))}
  </Table.Header>
);
