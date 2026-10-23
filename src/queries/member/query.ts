import fetchAndValidate from '@/lib/fetcher';
import {
  type MemberBody,
  MemberSchema,
  MembersSchema,
  type UpdateMemberBody,
} from './type';

export const getMembers = async () =>
  (await fetchAndValidate('me/members', MembersSchema)).items;

export const addMember = (body: MemberBody) =>
  fetchAndValidate('me/members', MemberSchema, { method: 'POST', body });

export const updateMember = (id: string, body: UpdateMemberBody) =>
  fetchAndValidate(`me/members/${id}`, MemberSchema, { method: 'PATCH', body });

export const removeMember = (id: string) =>
  fetchAndValidate(`me/members/${id}`, undefined, { method: 'DELETE' });
