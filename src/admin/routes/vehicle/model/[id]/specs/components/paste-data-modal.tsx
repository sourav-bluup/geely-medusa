import { Alert, Button, Heading, Text } from '@medusajs/ui';
import { ClipboardIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useModelSpecificationTable } from './table/model-specification-table-provider';

interface PasteDataModalProps {
  onClose: () => void;
}

export const PasteDataModal: React.FC<PasteDataModalProps> = ({ onClose }) => {
  const { onPaste } = useModelSpecificationTable();
  const pasteAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isPasting, setIsPasting] = useState(false);

  const handlePaste = useCallback(
    (event: React.ClipboardEvent<HTMLDivElement>) => {
      onPaste(event);
      onClose();
    },
    [onPaste, onClose],
  );

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handlePasteAreaClick = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="bg-ui-bg-overlay fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-ui-bg-base ring-ui-border-base w-96 rounded-lg p-6 shadow-2xl ring-1">
        <Heading level="h3" className="text-ui-fg-base mb-4 text-xl font-semibold">
          Paste Data
        </Heading>

        <Alert variant="info" title="Info" className="mb-2">
          <Text size="xsmall">
            Paste CSV data here. Each row is a specification, columns are trim levels. First column
            contains specification names, others contain values for each trim.
          </Text>
        </Alert>

        <div
          ref={pasteAreaRef}
          onPaste={handlePaste}
          onClick={handlePasteAreaClick}
          className="border-ui-border-base hover:bg-ui-bg-subtle ring-ui-border-base relative flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <textarea
            ref={textareaRef}
            className="absolute inset-0 h-full w-full opacity-0"
            onFocus={() => setIsPasting(true)}
            onBlur={() => setIsPasting(false)}
          />
          <ClipboardIcon className="text-ui-fg-muted mb-2 h-10 w-10" />
          <Text size="xsmall" className="text-ui-fg-subtle text-center">
            {isPasting ? 'Paste your data now' : 'Click here to paste your data'}
            <br />
            (Ctrl+V or Cmd+V)
          </Text>
        </div>
        <Button className="mt-4 w-full" variant="danger" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
