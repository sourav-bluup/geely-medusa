import { defineWidgetConfig } from '@medusajs/admin-sdk';
import type { AdminReservation } from '@medusajs/types';
import { Button, Heading, Text, toast } from '@medusajs/ui';
import { useState } from 'react';
import { sdk } from '../lib/skd';
import { ReservationStage } from '../routes/vehicle/reservations/new/types';
import { StageSelector } from '../routes/vehicle/reservations/components/stage-selector';
import { useSanityRevalidateAll } from '../hooks/api/sanity';

const ReservationStageWidget = ({ data }: { data: AdminReservation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState<ReservationStage>(
    (data.metadata?.stage as ReservationStage) || ReservationStage.TEST_DRIVE,
  );

  const { mutate: revalidateSanityAll } = useSanityRevalidateAll();

  const handleUpdateStage = async () => {
    setIsLoading(true);
    try {
      await sdk.admin.reservation.update(data.id, {
        metadata: {
          ...data.metadata,
          stage: currentStage,
        },
      });
      revalidateSanityAll();
      toast.success('Reservation stage updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update reservation stage');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-ui-bg-base border-ui-border-base rounded-lg border">
      <div className="p-4">
        <div className="flex flex-col gap-y-4">
          <Heading level="h2" className="text-ui-fg-base">
            Reservation Stage
          </Heading>
          <div className="flex flex-col gap-y-2">
            <Text className="text-ui-fg-subtle text-sm">Current Stage</Text>
            <StageSelector value={currentStage} onChange={setCurrentStage} />
            <Button
              variant="primary"
              size="small"
              onClick={handleUpdateStage}
              isLoading={isLoading}
              disabled={isLoading}
              className="mt-2 w-full"
            >
              Update Stage
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const config = defineWidgetConfig({
  zone: 'reservation.details.side.before',
});

export default ReservationStageWidget;
