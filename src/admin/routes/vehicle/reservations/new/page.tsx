import { defineRouteConfig } from '@medusajs/admin-sdk';
import { Container, Heading, Toaster } from '@medusajs/ui';
import { useNavigate } from 'react-router-dom';
import { ReservationForm } from '../components/reservation-form';

const NewReservationPage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <div className="flex flex-col gap-y-4">
        <div className="border-ui-border-base flex items-center justify-between border-b p-4">
          <div>
            <Heading level="h1">Create New Reservation</Heading>
          </div>
        </div>
        <ReservationForm onCancel={() => navigate('/reservations')} />
      </div>
      <Toaster />
    </Container>
  );
};

export const config = defineRouteConfig({
  label: 'New Reservation',
});

export default NewReservationPage;
