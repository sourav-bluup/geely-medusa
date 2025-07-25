import { Container, IconButton, Input } from '@medusajs/ui';
import { TrashIcon } from 'lucide-react';
import { UseFieldArrayRemove } from 'react-hook-form';
import Field from '../../../../../../components/ui/field';
import SelectField from '../../../../../../components/ui/select';
import {
  MediaInput,
  mediaTypeOptions,
} from '../../../../../../../modules/vehicle/types/vehicle-variant-media-type';
type MediaGridProps = {
  media: MediaInput[];
  remove: UseFieldArrayRemove;
};

const MediaGrid = ({ media, remove }: MediaGridProps) => {
  return (
    <div className="flex flex-col gap-4">
      {media.map((m, index) => (
        <Container key={index} className="flex gap-3 p-3">
          <div className="w-full max-w-[80px] shrink">
            <div className="relative aspect-square overflow-hidden rounded-md">
              <img
                className="absolute inset-0 h-full w-full items-center object-cover"
                src={m.url}
                alt={m.title}
              />
            </div>
          </div>
          <div className="grid grow grid-cols-[1fr_auto] gap-x-3">
            <div className="flex flex-col gap-y-2">
              <Field name={`media.${index}.title`}>
                {(field) => <Input {...field} placeholder="Title" />}
              </Field>
              <Field name={`media.${index}.media_type`} required>
                {(field) => (
                  <SelectField
                    options={mediaTypeOptions}
                    {...field}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    placeholder="Media Type"
                  />
                )}
              </Field>
            </div>
            <div className="flex justify-end">
              <IconButton size="small" onClick={() => remove(index)}>
                <TrashIcon />
              </IconButton>
            </div>
          </div>
        </Container>
      ))}
    </div>
  );
};

export default MediaGrid;
