enum TransmissionEnum {
  AUTO = 'auto', // Automatic transmission
  MANUAL = 'manual', // Manual transmission
  ELECTRIC = 'electric', // Electric vehicle transmission
  DCT6 = '6DCT', // 6-speed dual-clutch transmission
  DCT7 = '7DCT', // 7-speed dual-clutch transmission
  AT6 = '6AT', // 6-speed automatic transmission
  AT8 = '8AT', // 8-speed automatic transmission
  AT9 = '9AT', // 9-speed automatic transmission
  CVT = 'CVT', // Continuously Variable Transmission
  DSG = 'DSG', // Direct-Shift Gearbox (common in Volkswagen Group cars)
  AMT = 'AMT', // Automated Manual Transmission
  SEMI_AUTO = 'semi_auto', // Semi-automatic transmission
}

type TransmissionType = (typeof TransmissionEnum)[keyof typeof TransmissionEnum];

const TransmissionEnumLabels = {
  [TransmissionEnum.AUTO]: 'Automatic',
  [TransmissionEnum.MANUAL]: 'Manual',
  [TransmissionEnum.ELECTRIC]: 'Electric',
  [TransmissionEnum.DCT6]: '6-speed dual-clutch',
  [TransmissionEnum.DCT7]: '7-speed dual-clutch',
  [TransmissionEnum.AT6]: '6-speed automatic',
  [TransmissionEnum.AT8]: '8-speed automatic',
  [TransmissionEnum.AT9]: '9-speed automatic',
  [TransmissionEnum.CVT]: 'Continuously Variable',
  [TransmissionEnum.DSG]: 'Direct-Shift Gearbox',
  [TransmissionEnum.AMT]: 'Automated Manual',
  [TransmissionEnum.SEMI_AUTO]: 'Semi-automatic',
};

const toTransmissionLabel = (transmission: TransmissionType) =>
  TransmissionEnumLabels[transmission];

const transmissionOptions = Object.values(TransmissionEnum).map((value) => ({
  value,
  label: TransmissionEnumLabels[value as TransmissionType],
}));

export { TransmissionEnum, TransmissionEnumLabels, transmissionOptions, toTransmissionLabel };
