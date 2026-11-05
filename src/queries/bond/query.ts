import z from 'zod';
import fetchAndValidate from '@/lib/fetcher';
import { ContractSchema, type ContractType } from '@/queries/contract/type';
import {
  BondSchema,
  type BondType,
  type PurchaseBody,
  QuoteSchema,
  type QuoteType,
} from './type';

export const getBonds = (): Promise<BondType[]> =>
  fetchAndValidate('bonds', z.array(BondSchema));

export const getBond = (id: string): Promise<BondType> =>
  fetchAndValidate(`bonds/${id}`, BondSchema);

/** A bond's prospectus or cover file. */
export const getBondFile = (id: string, fileId: string): Promise<ArrayBuffer> =>
  fetchAndValidate<ArrayBuffer>(`bonds/${id}/files/${fileId}`, undefined, {
    responseType: 'arraybuffer',
    timeout: 60000,
  });

/** Checks a purchase and answers its terms; nothing is stored. */
export const quoteBond = (id: string, body: PurchaseBody): Promise<QuoteType> =>
  fetchAndValidate(`bonds/${id}/quote`, QuoteSchema, { method: 'POST', body });

/**
 * Buys the bond and pays it with the test payment: the contract comes back paid, numbered,
 * and waiting for the holder's signature. request_id sent again answers the same contract.
 */
export const buyBond = (
  id: string,
  body: PurchaseBody & { request_id: string },
): Promise<ContractType> =>
  fetchAndValidate(`bonds/${id}/purchase`, ContractSchema, {
    method: 'POST',
    body,
  });
