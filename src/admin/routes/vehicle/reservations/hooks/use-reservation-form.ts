import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@medusajs/ui';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { sdk } from '../../../../lib/skd';
import { ExtendedInventoryItem, ReservationStage } from '../new/types';
import { ReservationFormData, reservationSchema } from '../new/validation/schema';
import { useSanityRevalidateAll } from '../../../../hooks/api/sanity';

interface UseReservationFormReturn {
  form: ReturnType<typeof useForm<ReservationFormData>>;
  selectedItem: ExtendedInventoryItem | null;
  isLoading: boolean;
  handleSubmit: () => Promise<void>;
  handleItemSelect: (item: ExtendedInventoryItem) => void;
  handleLocationChange: (locationId: string) => void;
  handleQuantityChange: (quantity: number) => void;
  handleDescriptionChange: (description: string) => void;
  handleStageChange: (stage: ReservationStage) => void;
  handleRemoveItem: () => void;
}

export const useReservationForm = (): UseReservationFormReturn => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<ExtendedInventoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: revalidateSanityAll } = useSanityRevalidateAll();

  const form = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      inventory_item_id: '',
      location_id: '',
      quantity: 1,
      description: '',
      metadata: {
        stage: ReservationStage.TEST_DRIVE,
      },
    },
  });

  const createReservation = useMutation({
    mutationFn: async (data: ReservationFormData) => {
      try {
        // @ts-ignore
        return await sdk.admin.reservation.create(data);
      } catch (error) {
        // Log error for debugging
        console.error('Failed to create reservation:', error);
        throw error;
      }
    },
    onSuccess: ({ reservation }) => {
      toast.success('Success', {
        description: 'Reservation created successfully',
      });
      revalidateSanityAll();
      navigate(`/reservations/${reservation.id}`);
    },
    onError: (error) => {
      toast.error('Error', {
        description: error instanceof Error ? error.message : 'Failed to create reservation',
      });
    },
  });

  const handleSubmit = useCallback(async () => {
    try {
      setIsLoading(true);
      const values = form.getValues();
      await form.trigger(); // Validate all fields

      if (!form.formState.isValid) {
        return;
      }

      await createReservation.mutateAsync(values);
    } catch (error) {
      // Error is handled by mutation error callback
      console.error('Form submission failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [form, createReservation]);

  const handleItemSelect = useCallback(
    (item: ExtendedInventoryItem) => {
      setSelectedItem(item);
      form.setValue('inventory_item_id', item.id, { shouldValidate: true });
      // Reset dependent fields
      form.setValue('location_id', '', { shouldValidate: true });
      form.setValue('quantity', 1, { shouldValidate: true });
    },
    [form],
  );

  const handleLocationChange = useCallback(
    (locationId: string) => {
      form.setValue('location_id', locationId, { shouldValidate: true });
      form.setValue('quantity', 1, { shouldValidate: true });
    },
    [form],
  );

  const handleQuantityChange = useCallback(
    (quantity: number) => {
      form.setValue('quantity', quantity, { shouldValidate: true });
    },
    [form],
  );

  const handleDescriptionChange = useCallback(
    (description: string) => {
      form.setValue('description', description, { shouldValidate: true });
    },
    [form],
  );

  const handleStageChange = useCallback(
    (stage: ReservationStage) => {
      form.setValue('metadata.stage', stage, { shouldValidate: true });
    },
    [form],
  );

  const handleRemoveItem = useCallback(() => {
    setSelectedItem(null);
    form.reset({
      inventory_item_id: '',
      location_id: '',
      quantity: 1,
      description: '',
      metadata: {
        stage: ReservationStage.TEST_DRIVE,
      },
    });
  }, [form]);

  return {
    form,
    selectedItem,
    isLoading,
    handleSubmit,
    handleItemSelect,
    handleLocationChange,
    handleQuantityChange,
    handleDescriptionChange,
    handleStageChange,
    handleRemoveItem,
  };
};
