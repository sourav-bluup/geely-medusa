import { Table } from '@medusajs/ui';
import { Row } from '@tanstack/react-table';
import { cn } from '../../../../../../../../modules/vehicle/lib/utils';
import { TableRow } from './types';

interface TableBodyProps {
  rows: Row<TableRow>[];
}

export const TableBody = ({ rows }: TableBodyProps) => {
  return (
    <Table.Body>
      {rows.map((row) => (
        <Table.Row
          key={row.id}
          className={cn({
            'opacity-40': !row?.original?.is_active,
          })}
        >
          {row.getVisibleCells().map((cell) => (
            <Table.Cell key={cell.id}>
              {typeof cell.column.columnDef.cell === 'function'
                ? cell.column.columnDef.cell(cell.getContext())
                : (cell.getValue() as React.ReactNode)}
            </Table.Cell>
          ))}
        </Table.Row>
      ))}
    </Table.Body>
  );
};
