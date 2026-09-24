import { z } from "zod";

const patientSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  surname: z.string(),
  phone: z.string(),
});

export type Patient = z.infer<typeof patientSchema>;
