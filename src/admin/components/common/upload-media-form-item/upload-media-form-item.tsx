import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FileType, FileUpload } from '../file-upload';
import { Form } from '../form';
import {
  MediaInput,
  MediaType,
  VehicleVariantMediaInput,
} from '../../../../modules/vehicle/types/vehicle-variant-media-type';

const SUPPORTED_FORMATS = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/heic',
  'image/svg+xml',
];

export type UploadMediaFormItemProps = {
  form: UseFormReturn<VehicleVariantMediaInput>;
  append: (value: MediaInput) => void;
  showHint?: boolean;
};

const SUPPORTED_FORMATS_FILE_EXTENSIONS = ['.jpeg', '.png', '.gif', '.webp', '.heic', '.svg'];

export const UploadMediaFormItem = ({
  form,
  append,
  showHint = true,
}: UploadMediaFormItemProps) => {
  const { t } = useTranslation();

  const hasInvalidFiles = (fileList: FileType[]) => {
    const invalidFile = fileList.find((f) => !SUPPORTED_FORMATS.includes(f.file.type));

    if (invalidFile) {
      form.setError('media', {
        type: 'invalid_file',
        message: t('products.media.invalidFileType', {
          name: invalidFile.file.name,
          types: SUPPORTED_FORMATS_FILE_EXTENSIONS.join(', '),
        }),
      });

      return true;
    }

    return false;
  };

  return (
    <Form.Field
      control={form.control as UseFormReturn<VehicleVariantMediaInput>['control']}
      name="media"
      render={() => {
        return (
          <Form.Item>
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-col gap-y-1">
                <Form.Label optional>{t('products.media.label')}</Form.Label>
                {showHint && <Form.Hint>{t('products.media.editHint')}</Form.Hint>}
              </div>
              <Form.Control>
                <FileUpload
                  label={t('products.media.uploadImagesLabel')}
                  hint={t('products.media.uploadImagesHint')}
                  hasError={!!form.formState.errors.media}
                  formats={SUPPORTED_FORMATS}
                  onUploaded={(files) => {
                    form.clearErrors('media');
                    if (hasInvalidFiles(files)) {
                      return;
                    }
                    files.forEach((f) =>
                      append({
                        ...f,
                        title: f.file.name,
                        file_id: f.id,
                        mime_type: f.file.type,
                        media_type: MediaType.OTHER,
                        description: '',
                        variant_id: '',
                      }),
                    );
                  }}
                />
              </Form.Control>
              <Form.ErrorMessage />
            </div>
          </Form.Item>
        );
      }}
    />
  );
};
