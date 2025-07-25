import { titleToId } from '../../../utils/title-to-id';
import { Variant } from '../types';

export const getColorLabels = (variants: Variant[]) => {
  const bodyColors = variants
    .map((item) => ({
      id: item.body_color?.title ? titleToId(item.body_color?.title) : '',
      name: item.body_color?.title || '',
    }))
    .filter(
      (color, index, self) =>
        color.name !== '' && self.findIndex((c) => c.name === color.name) === index,
    );
  const interiorColors = variants
    .map((item) => ({
      id: item.interior_color?.title ? titleToId(item.interior_color?.title) : '',
      name: item.interior_color?.title || '',
    }))
    .filter(
      (color, index, self) =>
        color.id !== '' && self.findIndex((c) => c.name === color.name) === index,
    );
  return {
    bodyColor: bodyColors,
    interiorColor: interiorColors,
  };
};
