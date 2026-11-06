import fetchAndValidate from '@/lib/fetcher';
import { BondFileSchema } from '@/queries/bond/type';
import {
  type BondFileKind,
  type BondRequestBody,
  IssuerBondDetailSchema,
  IssuerBondListSchema,
} from './type';

// An upload carries a file of up to 20 MB, base64-encoded.
const uploadTimeout = 120_000;

export const getIssuerBonds = () =>
  fetchAndValidate('issuer/bonds', IssuerBondListSchema);

export const getIssuerBond = (id: string) =>
  fetchAndValidate(`issuer/bonds/${id}`, IssuerBondDetailSchema);

/** Sends a request: a draft of the member's issuer, which staff check and publish. */
export const requestBond = (body: BondRequestBody) =>
  fetchAndValidate('issuer/bonds', IssuerBondDetailSchema, {
    method: 'POST',
    body,
  });

export const uploadIssuerBondFile = (
  id: string,
  body: { kind: BondFileKind; file_name: string; content: string },
) =>
  fetchAndValidate(`issuer/bonds/${id}/files`, BondFileSchema, {
    method: 'POST',
    body,
    timeout: uploadTimeout,
  });

/** A file of one of the issuer's bonds, as it was uploaded. */
export const downloadIssuerBondFile = (id: string, fileId: string) =>
  fetchAndValidate<ArrayBuffer>(
    `issuer/bonds/${id}/files/${fileId}`,
    undefined,
    {
      responseType: 'arraybuffer',
    },
  );

/** The file's bytes, base64-encoded, as the API takes an upload. */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result);
      resolve(url.slice(url.indexOf(',') + 1));
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
