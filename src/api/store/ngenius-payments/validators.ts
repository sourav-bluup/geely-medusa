import z from 'zod';

const NgeniusPaymentCaptureSchema = z.object({
  referenceId: z.string(),
});

type NgeniusPaymentCaptureType = z.infer<typeof NgeniusPaymentCaptureSchema>;

export { NgeniusPaymentCaptureSchema, type NgeniusPaymentCaptureType };
