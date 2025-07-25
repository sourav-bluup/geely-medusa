export enum VehicleTypeEnum {
  NEW = 'new',
  CERTIFIED = 'certified',
}

export type VehicleType = (typeof VehicleTypeEnum)[keyof typeof VehicleTypeEnum];
