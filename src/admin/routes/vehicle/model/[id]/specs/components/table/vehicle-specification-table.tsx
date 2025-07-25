import { Alert, Button, Heading, Input, Switch, Table } from '@medusajs/ui';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { ClipboardIcon } from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { specificationCategoryOptions } from '../../../../../../../../modules/vehicle/enums/specification-category.enum';
import { UnitEnum, unitOptions } from '../../../../../../../../modules/vehicle/enums/unit.enum';
import { Form } from '../../../../../../../components/common';
import SelectField from '../../../../../../../components/ui/select';
import { PasteDataModal } from '../paste-data-modal';
import { CellSelect } from './cell/cell-form';
import { useModelSpecificationTable } from './model-specification-table-provider';
import { TableBody } from './table-body';
import { TableHeader } from './table-header';
import { TableRow } from './types';

const fieldTypeOptions = [
  {
    value: 'text',
    label: 'Text',
  },
  {
    value: 'number',
    label: 'Number',
  },
  {
    value: 'boolean',
    label: 'Boolean',
  },
];

const columnHelper = createColumnHelper<TableRow>();

export const VehicleSpecificationTable = () => {
  const { form, trimOptions, appendRow, updateRow, rowFields, headerFields, pasteError } =
    useModelSpecificationTable();

  const tableRef = useRef<HTMLTableElement>(null);

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'actions',
        header: 'Enabled',
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <Switch
              size="small"
              checked={rowFields[row.index].is_active}
              onCheckedChange={(checked) => {
                updateRow(row.index, { ...rowFields[row.index], is_active: checked });
              }}
            />
          </div>
        ),
      }),
      columnHelper.accessor('group', {
        header: () => (
          <CellSelect name="data.header.group" options={specificationCategoryOptions} />
        ),
        cell: (ctx) => (
          <Form.Field
            control={form.control}
            name={`data.rows.${ctx.row.index}.group`}
            render={({ field }) => <Input size="small" {...field} />}
          />
        ),
      }),
      columnHelper.accessor('type', {
        header: 'Type',
        cell: (ctx) => (
          <Form.Field
            control={form.control}
            name={`data.rows.${ctx.row.index}.type`}
            render={({ field }) => (
              <SelectField
                size="small"
                {...field}
                value={field.value ?? undefined}
                onValueChange={(value) => {
                  field.onChange(value);
                  updateRow(ctx.row.index, { ...ctx.row.original, type: value });
                }}
                placeholder="Select Type"
                options={fieldTypeOptions}
              />
            )}
          />
        ),
      }),
      columnHelper.accessor('unit', {
        header: 'Unit',
        cell: (ctx) => (
          <Form.Field
            control={form.control}
            name={`data.rows.${ctx.row.index}.unit`}
            render={({ field }) => (
              <SelectField
                size="small"
                {...field}
                value={field.value ?? undefined}
                onValueChange={(value: UnitEnum) => {
                  field.onChange(value);
                  updateRow(ctx.row.index, { ...ctx.row.original, unit: value });
                }}
                placeholder="Select Unit"
                options={unitOptions}
              />
            )}
          />
        ),
      }),
      ...headerFields?.map((_, index) =>
        columnHelper.accessor(`values.${index}` as any, {
          header: () => <CellSelect name={`data.header.values.${index}`} options={trimOptions} />,
          cell: ({ row }) => (
            <Form.Field
              control={form.control}
              name={`data.rows.${row.index}.values.${index}`}
              render={({ field }) => {
                const rowType = rowFields[row.index].type;
                return (
                  <Form.Item>
                    <Form.Control>
                      {rowType === 'boolean' ? (
                        <Switch
                          size="small"
                          defaultChecked={field.value.value === 'on'}
                          onCheckedChange={(checked) =>
                            field.onChange({ value: checked ? 'on' : 'off', id: field.value.id })
                          }
                        />
                      ) : (
                        <Input
                          {...field}
                          value={field.value?.value}
                          type={rowType}
                          size="small"
                          onChange={(e) => {
                            field.onChange({ ...field.value, value: e.target.value });
                          }}
                        />
                      )}
                    </Form.Control>
                  </Form.Item>
                );
              }}
            />
          ),
        }),
      ),
    ],
    [form, headerFields, rowFields, trimOptions, updateRow],
  );

  const table = useReactTable({
    columns,
    data: rowFields,
    getCoreRowModel: getCoreRowModel(),
  });

  const addNewRow = useCallback(() => {
    const newRowId = `row-${rowFields.length}`;
    const emptyValues = new Array(headerFields.length).fill('');
    appendRow({
      group: '',
      type: 'text',
      id: newRowId,
      values: emptyValues.map((v) => ({ value: v, id: '' })),
      is_active: true,
      unit: null,
      order: rowFields.length,
    });
  }, [appendRow, rowFields, headerFields]);

  const [isPasteModalOpen, setPasteModalOpen] = useState(false);

  const handlePasteClick = () => {
    setPasteModalOpen(true);
  };

  const handlePasteClose = () => {
    setPasteModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between">
        <div>
          <Heading level="h2">Specification Table</Heading>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" onClick={addNewRow} size="small">
            Add New Row
          </Button>
          /
          <Button type="button" onClick={handlePasteClick} size="small">
            <ClipboardIcon className="size-4" />
            <p>Paste your data</p>
          </Button>
        </div>
        {pasteError && (
          <Alert variant="error" title="Error" className="mb-2">
            {pasteError}
          </Alert>
        )}
      </div>
      {isPasteModalOpen && <PasteDataModal onClose={handlePasteClose} />}
      <Table ref={tableRef}>
        <TableHeader headerGroups={table.getHeaderGroups()} />
        <TableBody rows={table.getRowModel().rows} />
      </Table>
    </div>
  );
};
