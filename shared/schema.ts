import { z } from "zod";

// System schema
export const systemSchema = z.object({
  system_id: z.string(),
  system_name: z.string(),
  system_description: z.string(),
  business_steward_full_name: z.string(),
  business_steward_email: z.string().email(),
  security_steward_full_name: z.string(),
  security_steward_email: z.string().email(),
  technical_steward_full_name: z.string(),
  technical_steward_email: z.string().email(),
  created_at: z.string(),
  updated_at: z.string(),
  status: z.enum(['active', 'inactive', 'pending']).default('active'),
});

export const insertSystemSchema = systemSchema.omit({
  system_id: true,
  created_at: true,
  updated_at: true,
});

export type System = z.infer<typeof systemSchema>;
export type InsertSystem = z.infer<typeof insertSystemSchema>;
