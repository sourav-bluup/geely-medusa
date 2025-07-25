export enum OrderStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Cancelled = 'cancelled',
  Completed = 'completed',
}

export enum VehicleSpecificationTypeEnum {
  CHECKBOX = 'checkbox',
  TEXT = 'text',
  SELECT = 'select',
}

export interface EngineType {
  id: string;
  name: string;
}

export enum VehicleSeaterEnum {
  Two = 'two',
  Four = 'four',
  Five = 'five',
  Six = 'six',
  Seven = 'seven',
  Eight = 'eight',
  Nine = 'nine',
  Ten = 'ten',
  MoreThanTen = 'more_than_ten',
}

export enum ModelTypeEnum {
  MODEL = 'model',
  TRIM = 'trim',
}
