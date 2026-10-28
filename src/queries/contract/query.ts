import z from 'zod';
import fetchAndValidate from '@/lib/fetcher';
import {
  BondProductSchema,
  type BondProductType,
  type CoHolder,
  ContractSchema,
  ContractSummarySchema,
  type ContractSummaryType,
  type ContractType,
  type CreateContractBody,
  type Product,
  ProductPreviewSchema,
  type ProductPreviewType,
} from './type';

export const getProducts = (): Promise<BondProductType[]> =>
  fetchAndValidate('products', z.array(BondProductSchema));

/** The newest contracts, newest first; drafts are not listed. */
export const getContracts = (): Promise<ContractSummaryType[]> =>
  fetchAndValidate('contracts', z.array(ContractSummarySchema));

export const createContract = (
  body: CreateContractBody,
): Promise<ContractType> =>
  fetchAndValidate('contracts', ContractSchema, { method: 'POST', body });

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

/** Cancels a contract pending signature for every party. */
export const declineContract = (id: string): Promise<ContractType> =>
  fetchAndValidate(`contracts/${id}/decline`, ContractSchema, {
    method: 'POST',
    body: {},
  });

/**
 * What the browser fills the product's contract preview from; nothing is stored. The
 * co-holder travels in the body, so it stays out of URLs and logs.
 */
export const getProductPreview = (
  product: Product,
  coHolder?: CoHolder,
): Promise<ProductPreviewType> =>
  fetchAndValidate(`products/${product}/preview`, ProductPreviewSchema, {
    method: 'POST',
    body: coHolder ? { co_holder: coHolder } : {},
  });

/** What the browser fills a stored contract from, with its parties' signatures so far. */
export const getContractPreview = (id: string): Promise<ProductPreviewType> =>
  fetchAndValidate(`contracts/${id}/preview`, ProductPreviewSchema);

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
