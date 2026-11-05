import z from 'zod';
import fetchAndValidate from '@/lib/fetcher';
import {
  ContractPreviewSchema,
  type ContractPreviewType,
  ContractSchema,
  ContractSummarySchema,
  type ContractSummaryType,
  type ContractType,
} from './type';

/** The newest contracts, newest first; drafts are not listed. */
export const getContracts = (): Promise<ContractSummaryType[]> =>
  fetchAndValidate('contracts', z.array(ContractSummarySchema));

export const getContract = (id: string): Promise<ContractType> =>
  fetchAndValidate(`contracts/${id}`, ContractSchema);

/** The client's own signature, a base64 PNG, on a contract pending it. */
export const signContract = (
  id: string,
  signature: string,
): Promise<ContractType> =>
  fetchAndValidate(`contracts/${id}/signature`, ContractSchema, {
    method: 'POST',
    body: { signature },
  });

/** Cancels a contract pending signature for every party, or the holder's unpaid order. */
export const declineContract = (id: string): Promise<ContractType> =>
  fetchAndValidate(`contracts/${id}/decline`, ContractSchema, {
    method: 'POST',
    body: {},
  });

/** Pays the client's order with the test payment, where the backend allows it. */
export const mockPayContract = (id: string): Promise<ContractType> =>
  fetchAndValidate(`contracts/${id}/mock-payment`, ContractSchema, {
    method: 'POST',
    body: {},
  });

/** What the browser fills a stored contract from, with its parties' signatures so far. */
export const getContractPreview = (id: string): Promise<ContractPreviewType> =>
  fetchAndValidate(`contracts/${id}/preview`, ContractPreviewSchema);

/** A template's .docx, unfilled. */
export const getTemplateFile = (id: string): Promise<ArrayBuffer> =>
  fetchAndValidate<ArrayBuffer>(`templates/${id}/file`, undefined, {
    responseType: 'arraybuffer',
    timeout: 60000,
  });

/** The signed contract's PDF. */
export const getContractDocument = (id: string): Promise<ArrayBuffer> =>
  fetchAndValidate<ArrayBuffer>(`contracts/${id}/document`, undefined, {
    responseType: 'arraybuffer',
    timeout: 60000,
  });
