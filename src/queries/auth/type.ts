import z from 'zod';

// TODO: align with backend GET /me response.
export const MeSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export type MeType = z.infer<typeof MeSchema>;
