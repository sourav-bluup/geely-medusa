import { Checkbox } from '@medusajs/ui';
import { ColumnDef } from '@tanstack/react-table';
import { TableRow } from './types';

interface ColumnVisibilityToggleProps {
  columns: ColumnDef<TableRow>[];
  hiddenColumns: Set<string>;
  toggleColumnVisibility: (columnId: string) => void;
}

export const ColumnVisibilityToggle = ({
  columns,
  hiddenColumns,
  toggleColumnVisibility,
}: ColumnVisibilityToggleProps) => (
  <div>
    {columns.map((column) => (
      <label key={column.id as string}>
        <Checkbox
          checked={!hiddenColumns.has(column.id as string)}
          onCheckedChange={() => toggleColumnVisibility(column.id as string)}
        />
        {column.id === 'group' ? 'Group' : `Value ${column.id?.replace('value', '')}`}
      </label>
    ))}
  </div>
);
