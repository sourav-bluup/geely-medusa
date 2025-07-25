import { zodResolver } from '@hookform/resolvers/zod';
import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useFieldArray, useForm, UseFormReturn } from 'react-hook-form';
import { SpecificationSchema } from '../../../../../../../../api/admin/vehicle/model/validators';
import { SpecificationCategoryEnum } from '../../../../../../../../modules/vehicle/enums/specification-category.enum';
import { VehicleTrimDto } from '../../../../../../../../modules/vehicle/types/vehicle-trim.type';
import { usePasteToGroupedArray } from '../../../../../../../hooks/use-paste-to-array';
import { ModelSpecificationDto } from '../../../../../../../../modules/vehicle/types/trim-specification.types';
import { mapSpecificationsToTableData } from '../transformer';
import { SpecificationInput } from './types';

//@ts-ignore
import { titleCase } from 'title-case';

type ModelSpecificationTableContextType = {
  form: UseFormReturn<SpecificationInput>;
  headerFields: SpecificationInput['data']['header']['values'];
  rowFields: SpecificationInput['data']['rows'];
  appendHeader: (value: any) => void;
  appendRow: (value: any) => void;
  updateRow: (index: number, value: any) => void;
  trimOptions: { value: string; label: string }[];
  onPaste: (e: React.ClipboardEvent<HTMLDivElement>) => void;
  pasteError: string | null;
  defaultGroup: SpecificationCategoryEnum;
};
const ModelSpecificationTableContext = createContext<
  ModelSpecificationTableContextType | undefined
>(undefined);

type Props = {
  children: React.ReactNode;
  specifications?: ModelSpecificationDto[];
  trims: VehicleTrimDto[];
  defaultGroup?: SpecificationCategoryEnum;
};

export const ModelSpecificationTableProvider: React.FC<Props> = ({
  children,
  trims,
  specifications,
  defaultGroup = SpecificationCategoryEnum.Other,
}) => {
  const trimOptions = useMemo(
    () =>
      trims.map((trim) => ({
        value: trim.id,
        label: trim.title,
      })),
    [trims],
  );

  // Use the transformer to get initial form data
  const initialFormData = useMemo(
    () => mapSpecificationsToTableData({ specifications, trims, defaultGroup }),
    [specifications, trims],
  );

  const {
    data,
    handlePaste,
    error: pasteError,
  } = usePasteToGroupedArray<HTMLDivElement>(trims.length);

  const form = useForm<SpecificationInput>({
    resolver: zodResolver(SpecificationSchema),
    defaultValues: {
      data: {
        header: {
          group: { value: defaultGroup },
          values: [],
        },
        rows: [],
      },
    },
  });

  const { append: appendHeader } = useFieldArray({
    control: form.control,
    name: 'data.header.values',
  });

  const { append: appendRow, update: updateRow } = useFieldArray({
    control: form.control,
    name: 'data.rows',
  });

  const rowFields = form.watch('data.rows') || [];
  const headerFields = form.watch('data.header.values') || [];

  const updateFormData = () => {
    const currentHeaderLength = headerFields.length;
    const pastedColumnsLength = data[0]?.values.length || 0;

    // Only add new headers if pasted data has more columns
    if (pastedColumnsLength > currentHeaderLength) {
      const newHeaders = Array.from(
        { length: pastedColumnsLength - currentHeaderLength },
        (_, i) => ({
          value: `new-column-${currentHeaderLength + i}`,
          label: `New Column ${currentHeaderLength + i + 1}`,
        }),
      );
      appendHeader(newHeaders);
    }

    const updatedRows = data.map((item, index) => {
      const hasOnOff = item.values.every((value) => value === 'on' || value === 'off');
      const hasAnyValue = item.values.some((value) => value !== '') || false;
      const isNumber = item.values.every((value) => !isNaN(Number(value)) && value !== '');

      return {
        group: titleCase(item.group),
        type: hasOnOff ? ('boolean' as const) : isNumber ? ('number' as const) : ('text' as const),
        id: `row-${index}`,
        values: item.values
          .map((value) => ({
            value: hasOnOff ? value : isNumber ? value : titleCase(value),
            id: '',
          }))
          .concat(Array(currentHeaderLength - item.values.length).fill({ value: '', id: '' })), // Add empty cells if needed
        is_active: hasAnyValue,
        unit: null,
        order: index,
      };
    });

    // If pasted data has fewer rows than current data, add empty rows
    if (updatedRows.length < rowFields.length) {
      const emptyRows = Array(rowFields.length - updatedRows.length).fill({
        group: '',
        type: 'text' as const,
        id: '',
        values: Array(currentHeaderLength).fill({ value: '', id: '' }),
        is_active: false,
        unit: null,
        order: 0,
      });
      updatedRows.push(...emptyRows);
    }

    updatedRows.forEach((row, index) => {
      if (index < rowFields.length) {
        updateRow(index, row);
      } else {
        appendRow(row);
      }
    });
  };

  const onPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    handlePaste(e);
    updateFormData();
  };

  const value = useMemo(
    () => ({
      form,
      headerFields,
      rowFields,
      appendHeader,
      appendRow,
      updateRow,
      trimOptions,
      onPaste,
      pasteError,
      defaultGroup,
    }),
    [
      form,
      headerFields,
      rowFields,
      appendHeader,
      appendRow,
      updateRow,
      trimOptions,
      onPaste,
      pasteError,
      defaultGroup,
    ],
  );

  useEffect(() => {
    updateFormData();
  }, [data]);

  useEffect(() => {
    form.reset(initialFormData);
  }, [initialFormData, form]);

  return (
    <ModelSpecificationTableContext.Provider value={value}>
      {children}
    </ModelSpecificationTableContext.Provider>
  );
};

export const useModelSpecificationTable = () => {
  const context = useContext(ModelSpecificationTableContext);
  if (!context) {
    throw new Error('useVehicleSpecification must be used within a VehicleSpecificationProvider');
  }
  return context;
};
