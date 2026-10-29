import { queryOptions } from '@tanstack/react-query';
import {
  getContract,
  getContractDocument,
  getContractPreview,
  getContracts,
  getProductPreview,
  getProducts,
  getTemplateFile,
} from './query';
import type {
  CoHolder,
  ContractType,
  PartyType,
  Product,
  PurchasableOwnership,
} from './type';

export const contractKeys = {
  all: ['contract'] as const,
  list: () => [...contractKeys.all, 'list'] as const,
  products: () => [...contractKeys.all, 'products'] as const,
  detail: (id: string) => [...contractKeys.all, 'detail', id] as const,
  preview: (id: string) => [...contractKeys.all, 'preview', id] as const,
  productPreview: (
    product: Product,
    ownership: PurchasableOwnership,
    coHolder?: CoHolder,
  ) =>
    [
      ...contractKeys.all,
      'product-preview',
      product,
      ownership,
      coHolder?.register_no ?? '',
      coHolder?.phone ?? '',
    ] as const,
  templateFile: (id: string) =>
    [...contractKeys.all, 'template-file', id] as const,
  document: (id: string) => [...contractKeys.all, 'document', id] as const,
};

/** The client's own party on the contract. */
export function yourParty(contract: ContractType): PartyType | undefined {
  return contract.parties.find((p) => p.id === contract.your_party_id);
}

/** Whether the contract waits for the client's own signature. */
export function awaitingYou(contract: ContractType): boolean {
  const you = yourParty(contract);
  return (
    contract.status === 'pending_signature' &&
    !!you?.signs &&
    !you.signed_at &&
    !you.declined_at
  );
}

/**
 * How long a page polls for a signed PDF before it stops and offers to check again. The
 * PDF usually renders within seconds; past this, polling costs requests and helps nobody.
 */
export const pdfPollLimit = 2 * 60 * 1000;

/**
 * The wait before the next check for a signed PDF, elapsed ms after the page started
 * polling: often at first, when the PDF usually arrives, then less often.
 */
export function pdfPollDelay(elapsed: number): number {
  if (elapsed < 5_000) return 2_000;
  if (elapsed < 20_000) return 3_000;
  if (elapsed < 40_000) return 4_500;
  return 5_000;
}

/** One contract. The page showing it polls while its PDF renders (pdfPollDelay). */
export function contractOptions(id: string) {
  return queryOptions({
    queryKey: contractKeys.detail(id),
    queryFn: () => getContract(id),
  });
}

/**
 * What a stored contract's document is filled from, with the signatures given so far. Each
 * read fetches the signatures from storage, so it stays fresh for a while; signing
 * invalidates it.
 */
export function contractPreviewOptions(id: string) {
  return queryOptions({
    queryKey: contractKeys.preview(id),
    queryFn: () => getContractPreview(id),
    staleTime: 5 * 60 * 1000,
  });
}

export function contractsOptions() {
  return queryOptions({
    queryKey: contractKeys.list(),
    queryFn: getContracts,
  });
}

/**
 * The bonds the app sells, each with the kinds of contract it is sold under. A joint one
 * asks for the co-holder before its preview; they sign from their own account.
 */
export function productsOptions() {
  return queryOptions({
    queryKey: contractKeys.products(),
    queryFn: getProducts,
  });
}

/**
 * The preview is dated today; a few minutes old is still current. A joint contract
 * previews with its co-holder only.
 */
export function productPreviewOptions(
  product: Product,
  ownership: PurchasableOwnership,
  coHolder?: CoHolder,
) {
  return queryOptions({
    queryKey: contractKeys.productPreview(product, ownership, coHolder),
    queryFn: () => getProductPreview(product, ownership, coHolder),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * A template never changes once active, nor after it is retired: its id names one version
 * of the file.
 */
export function templateFileOptions(id: string) {
  return queryOptions({
    queryKey: contractKeys.templateFile(id),
    queryFn: () => getTemplateFile(id),
    staleTime: Number.POSITIVE_INFINITY,
  });
}

/**
 * A signed contract's PDF. It never changes once signed, so the page that shows it and the
 * download share one fetch.
 */
export function contractDocumentOptions(id: string) {
  return queryOptions({
    queryKey: contractKeys.document(id),
    queryFn: () => getContractDocument(id),
    staleTime: Number.POSITIVE_INFINITY,
  });
}
