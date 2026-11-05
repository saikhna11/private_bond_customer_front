import { queryOptions } from '@tanstack/react-query';
import { type ContractApi, clientContractApi } from './api';
import { getContracts } from './query';
import type { ContractType, PartyType } from './type';

export const contractKeys = {
  all: ['contract'] as const,
  list: () => [...contractKeys.all, 'list'] as const,
  detail: (id: string) => [...contractKeys.all, 'detail', id] as const,
  preview: (id: string) => [...contractKeys.all, 'preview', id] as const,
  templateFile: (id: string) =>
    [...contractKeys.all, 'template-file', id] as const,
  document: (id: string) => [...contractKeys.all, 'document', id] as const,
};

/**
 * The keys of a stored contract's queries through api: the client's are contractKeys,
 * the issuer portal's their own.
 */
export function storedKeys(api: ContractApi) {
  const all = [api.root] as const;
  return {
    all,
    list: () => [...all, 'list'] as const,
    detail: (id: string) => [...all, 'detail', id] as const,
    preview: (id: string) => [...all, 'preview', id] as const,
    templateFile: (id: string) => [...all, 'template-file', id] as const,
    document: (id: string) => [...all, 'document', id] as const,
  };
}

/** The reader's own party on the contract, if any (your_party_id). */
export function yourParty(contract: ContractType): PartyType | undefined {
  return contract.parties.find((p) => p.id === contract.your_party_id);
}

/** Whether the contract still waits for a signature, its clients' or its issuer's. */
export function isPending(status: ContractType['status']): boolean {
  return (
    status === 'pending_customer_signature' ||
    status === 'pending_issuer_signature'
  );
}

/**
 * The status in which party signs or declines: the issuer's director once every client
 * party has signed, any other party before.
 */
export function signingStatus(party: PartyType): ContractType['status'] {
  return party.type === 'issuer'
    ? 'pending_issuer_signature'
    : 'pending_customer_signature';
}

/** Whether the contract waits for the reader's own signature, at their turn. */
export function awaitingYou(contract: ContractType): boolean {
  const you = yourParty(contract);
  return (
    !!you?.signs &&
    contract.status === signingStatus(you) &&
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
export function contractOptions(id: string, api = clientContractApi) {
  return queryOptions({
    queryKey: storedKeys(api).detail(id),
    queryFn: () => api.getContract(id),
  });
}

/**
 * What a stored contract's document is filled from, with the signatures given so far. Each
 * read fetches the signatures from storage, so it stays fresh for a while; signing
 * invalidates it.
 */
export function contractPreviewOptions(id: string, api = clientContractApi) {
  return queryOptions({
    queryKey: storedKeys(api).preview(id),
    queryFn: () => api.getContractPreview(id),
    staleTime: 5 * 60 * 1000,
  });
}

/** The client's own contracts; the issuer portal pages its own (issuerContractsOptions). */
export function contractsOptions() {
  return queryOptions({
    queryKey: storedKeys(clientContractApi).list(),
    queryFn: getContracts,
  });
}

/**
 * A template never changes once active, nor after it is retired: its id names one version
 * of the file.
 */
export function templateFileOptions(id: string, api = clientContractApi) {
  return queryOptions({
    queryKey: storedKeys(api).templateFile(id),
    queryFn: () => api.getTemplateFile(id),
    staleTime: Number.POSITIVE_INFINITY,
  });
}

/**
 * A signed contract's PDF. It never changes once signed, so the page that shows it and the
 * download share one fetch.
 */
export function contractDocumentOptions(id: string, api = clientContractApi) {
  return queryOptions({
    queryKey: storedKeys(api).document(id),
    queryFn: () => api.getContractDocument(id),
    staleTime: Number.POSITIVE_INFINITY,
  });
}
