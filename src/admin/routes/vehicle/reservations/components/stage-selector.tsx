import { Select } from '@medusajs/ui';
import { ReservationStage } from '../new/types';

interface StageSelectorProps {
  value: ReservationStage;
  onChange: (value: ReservationStage) => void;
}

const stageOptions = [
  {
    label: 'Test Drive',
    value: ReservationStage.TEST_DRIVE,
  },
  {
    label: 'Purchase',
    value: ReservationStage.PURCHASE,
  },
  {
    label: 'Cancelled',
    value: ReservationStage.CANCELLED,
  },
];

export const StageSelector = ({ value, onChange }: StageSelectorProps) => {
  return (
    <div className="flex flex-col gap-y-2">
      <span className="text-ui-fg-subtle text-sm font-medium">Reservation Stage</span>
      <Select value={value} onValueChange={(val) => onChange(val as ReservationStage)}>
        <Select.Trigger>
          <Select.Value placeholder="Select a stage" />
        </Select.Trigger>
        <Select.Content>
          {stageOptions.map((option) => (
            <Select.Item key={option.value} value={option.value}>
              {option.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    </div>
  );
};
