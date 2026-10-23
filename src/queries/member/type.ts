import z from 'zod';

/** One of an organization's officers. */
export const MemberSchema = z.object({
  id: z.string(),
  org_id: z.string(),
  last_name: z.string(),
  first_name: z.string(),
  phone: z.string(),
  /** Absent on officers added before emails were asked for. */
  email: z.string().optional(),
  /** Absent until given: the officer who signed up starts without one. */
  position: z.string().optional(),
  is_active: z.boolean(),
  created_at: z.string(),
});

/** GET /me/members: oldest first. */
export const MembersSchema = z.object({ items: z.array(MemberSchema) });

export type MemberType = z.infer<typeof MemberSchema>;

/** POST /me/members. */
export interface MemberBody {
  last_name: string;
  first_name: string;
  /** 8 digits for Mongolia, else + code and digits. */
  phone: string;
  email: string;
  position: string;
}

/** PATCH /me/members/{id}: send only what changed. */
export type UpdateMemberBody = Partial<MemberBody>;
