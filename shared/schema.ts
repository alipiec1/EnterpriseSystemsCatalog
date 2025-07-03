import { z } from 'zod';

// System schema for the Enterprise Systems Catalog
export const systemSchema = z.object({
  system_id: z.string(),
  system_name: z.string(),
  system_description: z.string(),
  business_steward_email: z.string().email(),
  business_steward_full_name: z.string(),
  security_steward_email: z.string().email(),
  security_steward_full_name: z.string(),
  technical_steward_email: z.string().email(),
  technical_steward_full_name: z.string(),
  status: z.enum(['active', 'inactive', 'pending']),
  created_at: z.string(),
  updated_at: z.string(),
});

// Insert schema for creating new systems (excludes auto-generated fields)
export const insertSystemSchema = z.object({
  system_name: z.string().min(1, 'System name is required'),
  system_description: z.string().min(1, 'System description is required'),
  business_steward_email: z.string().email('Invalid email format'),
  business_steward_full_name: z.string().min(1, 'Business steward name is required'),
  security_steward_email: z.string().email('Invalid email format'),
  security_steward_full_name: z.string().min(1, 'Security steward name is required'),
  technical_steward_email: z.string().email('Invalid email format'),
  technical_steward_full_name: z.string().min(1, 'Technical steward name is required'),
  status: z.enum(['active', 'inactive', 'pending']).default('active'),
});

// Update schema for updating existing systems (all fields optional except constraints)
export const updateSystemSchema = z.object({
  system_name: z.string().min(1, 'System name cannot be empty').optional(),
  system_description: z.string().min(1, 'System description cannot be empty').optional(),
  business_steward_email: z.string().email('Invalid email format').optional(),
  business_steward_full_name: z.string().min(1, 'Business steward name cannot be empty').optional(),
  security_steward_email: z.string().email('Invalid email format').optional(),
  security_steward_full_name: z.string().min(1, 'Security steward name cannot be empty').optional(),
  technical_steward_email: z.string().email('Invalid email format').optional(),
  technical_steward_full_name: z.string().min(1, 'Technical steward name cannot be empty').optional(),
  status: z.enum(['active', 'inactive', 'pending']).optional(),
});

// Type exports
export type System = z.infer<typeof systemSchema>;
export type InsertSystem = z.infer<typeof insertSystemSchema>;
export type UpdateSystem = z.infer<typeof updateSystemSchema>;