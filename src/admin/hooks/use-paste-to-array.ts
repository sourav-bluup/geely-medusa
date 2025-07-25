import { useEffect, useState } from 'react';

function usePasteToArray() {
  const [values, setValues] = useState<string[]>([]);

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedData = e.clipboardData.getData('Text');
    // Split the pasted data by new lines and filter out empty lines
    const arrayData = pastedData.split(/\r?\n/).filter(Boolean);
    setValues(arrayData);
  };

  return {
    values,
    handlePaste,
  };
}

export type GroupedData = {
  group: string;
  values: string[];
};

type UsePasteResult<T> = {
  data: GroupedData[];
  isError: boolean;
  error: string | null;
  handlePaste: (e: React.ClipboardEvent<T>) => void;
};

const usePasteToGroupedArray = <T>(initialColumnCount: number = 3): UsePasteResult<T> => {
  const [data, setData] = useState<GroupedData[]>([]);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [columnCount, setColumnCount] = useState<number | undefined>(initialColumnCount);

  useEffect(() => {
    if (initialColumnCount !== undefined) {
      setColumnCount(initialColumnCount);
    }
  }, [initialColumnCount]);

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedData = e.clipboardData.getData('Text');
    const rows = pastedData.split(/\r?\n/).filter(Boolean);

    // Check if the data format is valid: at least one group and one value per row
    const invalidRow = rows.some((row) => row.split(/\t/).length < 2);
    if (invalidRow) {
      setIsError(true);
      setError(
        'Invalid data format. Each row should contain a group name followed by at least one value, separated by tabs. Please check your data and try again.',
      );
      setData([]);
      return;
    }

    const parsedData: GroupedData[] = rows.map((row) => {
      const [group, ...values] = row.split(/\t/); // split by tab characters

      // Remove empty values from the values array and convert special characters
      const nonEmptyValues = values.slice(0, columnCount ? columnCount : undefined).map((value) => {
        const trimmedValue = value.trim();
        if (/^[ü✓✔️☑️✅]$/u.test(trimmedValue)) return 'on';
        if (/^[✗✘û❌❎]$/u.test(trimmedValue)) return 'off';
        if (/^(yes|true)$/i.test(trimmedValue)) return 'on';
        if (/^(no|false)$/i.test(trimmedValue)) return 'off';
        if (/^n\/a$/i.test(trimmedValue)) return 'N/A';
        return trimmedValue;
      });

      return {
        group: group.trim(),
        values: nonEmptyValues,
      };
    });

    setIsError(false); // Reset error state
    setError(null);
    setData(parsedData);
  };

  return {
    data,
    isError,
    error,
    handlePaste: handlePaste as (e: React.ClipboardEvent<T>) => void,
  };
};

export { usePasteToArray, usePasteToGroupedArray };
