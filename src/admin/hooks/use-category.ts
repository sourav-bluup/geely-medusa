import { useProductCategories } from './api/category';

const useGetCategoryOptions = (handle: string) => {
  const { product_categories } = useProductCategories({
    handle,
    include_descendants_tree: true,
    limit: 1,
  });

  const parentCategory = product_categories?.[0];

  const { product_categories: children } = useProductCategories({
    parent_category_id: parentCategory?.id || 'IGNORE',
    limit: 100,
  });

  const options = children?.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  return {
    options,
  };
};

export default useGetCategoryOptions;
