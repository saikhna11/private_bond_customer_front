import { createContext, useContext } from 'react';
import z from 'zod';
import fetchAndValidate from '@/lib/fetcher';
import {
  declineContract,
  getContract,
  getContractDocument,
  getContractPreview,
  getContracts,
  getTemplateFile,
  signContract,
} from './query';
import {
  ContractPreviewSchema,
  type ContractPreviewType,
  ContractSchema,
  ContractSummarySchema,
  type ContractSummaryType,
  type ContractType,
} from './type';

/**
 * Where a stored contract is read and signed from: the client's own contracts, or the
 * contracts a bond issuer's director signs on the issuer portal. The two keep their caches
 * apart (root), since one browser may hold both sessions.
 */
export interface ContractApi {
  root: string;
  getContracts: () => Promise<ContractSummaryType[]>;
  getContract: (id: string) => Promise<ContractType>;
  getContractPreview: (id: string) => Promise<ContractPreviewType>;
  getTemplateFile: (id: string) => Promise<ArrayBuffer>;
  signContract: (id: string, signature: string) => Promise<ContractType>;
  declineContract: (id: string) => Promise<ContractType>;
  getContractDocument: (id: string) => Promise<ArrayBuffer>;
}

/** The client's own contracts. */
export const clientContractApi: ContractApi = {
  root: 'contract',
  getContracts,
  getContract,
  getContractPreview,
  getTemplateFile,
  signContract,
  declineContract,
  getContractDocument,
};

/** The contracts the signed-in issuer member signs as their bond issuer's director. */
export const issuerContractApi: ContractApi = {
  root: 'issuer-contract',
  getContracts: () =>
    fetchAndValidate('issuer/contracts', z.array(ContractSummarySchema)),
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
  declineContract: (id) =>
    fetchAndValidate(`issuer/contracts/${id}/decline`, ContractSchema, {
      method: 'POST',
      body: {},
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
