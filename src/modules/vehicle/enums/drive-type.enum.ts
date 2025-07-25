enum DriveTypeEnum {
  FRONT_WHEEL_DRIVE = 'front_wheel_drive',
  REAR_WHEEL_DRIVE = 'rear_wheel_drive',
  ALL_WHEEL_DRIVE = 'all_wheel_drive',
  FOUR_WHEEL_DRIVE = 'four_wheel_drive',
  TWO_WHEEL_DRIVE = 'two_wheel_drive',
  FOUR_AND_ALL_WHEEL_DRIVE = 'four_and_all_wheel_drive',
  TWO_AND_ALL_WHEEL_DRIVE = 'two_and_all_wheel_drive',
  TWO_AND_FOUR_WHEEL_DRIVE = 'two_and_four_wheel_drive',
}

type DriveType = (typeof DriveTypeEnum)[keyof typeof DriveTypeEnum];

const driveTypeLabels: Record<DriveType, string> = {
  [DriveTypeEnum.FRONT_WHEEL_DRIVE]: 'Front Wheel Drive',
  [DriveTypeEnum.REAR_WHEEL_DRIVE]: 'Rear Wheel Drive',
  [DriveTypeEnum.ALL_WHEEL_DRIVE]: 'All Wheel Drive',
  [DriveTypeEnum.FOUR_WHEEL_DRIVE]: 'Four Wheel Drive',
  [DriveTypeEnum.TWO_WHEEL_DRIVE]: 'Two Wheel Drive',
  [DriveTypeEnum.FOUR_AND_ALL_WHEEL_DRIVE]: 'Four and All Wheel Drive',
  [DriveTypeEnum.TWO_AND_ALL_WHEEL_DRIVE]: 'Two and All Wheel Drive',
  [DriveTypeEnum.TWO_AND_FOUR_WHEEL_DRIVE]: 'Two and Four Wheel Drive',
};

const driveTypeOptions = Object.values(DriveTypeEnum).map((value) => ({
  value,
  label: driveTypeLabels[value],
}));

const toDriveTypeLabel = (driveType: DriveType) => driveTypeLabels[driveType];

export { DriveTypeEnum, driveTypeLabels, driveTypeOptions, toDriveTypeLabel };
