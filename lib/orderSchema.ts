import { z } from "zod";

export const orderSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(3),
  priority: z.enum(["LOW", "MED", "HIGH"]),
});

export type OrderInput = z.infer<typeof orderSchema>;
