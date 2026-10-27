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
import type { BondProductType, ContractType, PartyType, Product } from './type';

export const contractKeys = {
  all: ['contract'] as const,
  list: () => [...contractKeys.all, 'list'] as const,
  products: () => [...contractKeys.all, 'products'] as const,
  detail: (id: string) => [...contractKeys.all, 'detail', id] as const,
  preview: (id: string) => [...contractKeys.all, 'preview', id] as const,
  productPreview: (product: Product) =>
    [...contractKeys.all, 'product-preview', product] as const,
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
 * The bonds the app sells: none with a co-holder (SONO), which it has no step to name, so
 * no card shows them and their ?product= URL answers that the product is not found.
 * Contracts already stored keep their pages, and each party still signs from their own
 * account. A stable function, so the query reruns it only when the products change.
 */
function offered(products: BondProductType[]): BondProductType[] {
  return products.filter((p) => !p.co_holder);
}

export function productsOptions() {
  return queryOptions({
    queryKey: contractKeys.products(),
    queryFn: getProducts,
    select: offered,
  });
}

/** The preview is dated today; a few minutes old is still current. */
export function productPreviewOptions(product: Product) {
  return queryOptions({
    queryKey: contractKeys.productPreview(product),
    queryFn: () => getProductPreview(product),
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
