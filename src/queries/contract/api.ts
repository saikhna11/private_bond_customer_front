import { createContext, useContext } from 'react';
import fetchAndValidate from '@/lib/fetcher';
import {
  declineContract,
  getContract,
  getContractDocument,
  getContractPreview,
  getTemplateFile,
  signContract,
} from './query';
import {
  ContractPreviewSchema,
  type ContractPreviewType,
  ContractSchema,
  type ContractType,
} from './type';

/**
 * Where a stored contract is read and signed from: the client's own contracts, or the
 * contracts of a bond issuer on the issuer portal, which every member reads and its director
 * signs or declines for a reason. The two keep their caches apart (root), since one browser
 * may hold both sessions. Each lists its contracts its own way.
 */
export interface ContractApi {
  root: string;
  getContract: (id: string) => Promise<ContractType>;
  getContractPreview: (id: string) => Promise<ContractPreviewType>;
  getTemplateFile: (id: string) => Promise<ArrayBuffer>;
  signContract: (id: string, signature: string) => Promise<ContractType>;
  /** reason is the director's, which the issuer portal requires; a client gives none. */
  declineContract: (id: string, reason?: string) => Promise<ContractType>;
  getContractDocument: (id: string) => Promise<ArrayBuffer>;
}

/** The client's own contracts. */
export const clientContractApi: ContractApi = {
  root: 'contract',
  getContract,
  getContractPreview,
  getTemplateFile,
  signContract,
  declineContract,
  getContractDocument,
};

/** The contracts of the signed-in issuer member's bond issuer. */
export const issuerContractApi: ContractApi = {
  root: 'issuer-contract',
  getContract: (id) =>
    fetchAndValidate(`issuer/contracts/${id}`, ContractSchema),
  getContractPreview: (id) =>
    fetchAndValidate(`issuer/contracts/${id}/preview`, ContractPreviewSchema),
  getTemplateFile: (id) =>
    fetchAndValidate<ArrayBuffer>(`issuer/templates/${id}/file`, undefined, {
      responseType: 'arraybuffer',
      timeout: 60000,
    }),
  signContract: (id, signature) =>
    fetchAndValidate(`issuer/contracts/${id}/signature`, ContractSchema, {
      method: 'POST',
      body: { signature },
    }),
  declineContract: (id, reason) =>
    fetchAndValidate(`issuer/contracts/${id}/decline`, ContractSchema, {
      method: 'POST',
      body: { reason },
    }),
  getContractDocument: (id) =>
    fetchAndValidate<ArrayBuffer>(
      `issuer/contracts/${id}/document`,
      undefined,
      {
        responseType: 'arraybuffer',
        timeout: 60000,
      },
    ),
};

/** The API the contract parts below read and sign through; the client's by default. */
export const ContractApiContext = createContext<ContractApi>(clientContractApi);

export function useContractApi(): ContractApi {
  return useContext(ContractApiContext);
}
