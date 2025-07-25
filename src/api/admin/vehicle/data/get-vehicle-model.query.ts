type GetVehicleModelQueryOperation = {
  query: any;
  id?: string;
};

const getVehicleModelQuery = async ({ query, id }: GetVehicleModelQueryOperation): Promise<any> => {
  const { data } = await query.graph({
    entity: 'vehicle_model',
    fields: [
      'id',
      'title',
      'handle',
      'engine',
      'transmission',
      'fuel_type',
      'body_type',
      'drive_type',
      'introduction_year',
      'door_count',
      'seat_count',
      'discontinued_year',
      'category_id',
      'engine_category.id',
      'engine_category.name',
      'transmission_category.id',
      'transmission_category.name',
      'fuel_type_category.id',
      'fuel_type_category.name',
      'body_type_category.id',
      'body_type_category.name',
      'drive_type_category.id',
      'drive_type_category.name',
      'year_category.id',
      'year_category.name',
      'model_category.id',
      'model_category.name',
      'trims.id',
      'trims.title',
      'trims.handle',
      'trims.is_default',
      'make.id',
      'make.name',
      'created_at',
      'updated_at',
      'deleted_at',
    ],
    ...(id && { filters: { id } }),
  });
  return id ? data[0] : data;
};

export { getVehicleModelQuery };
