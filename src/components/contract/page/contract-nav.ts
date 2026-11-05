/**
 * Where a stored contract's page goes, and whether it shows the signing step: the
 * client's contracts page or the issuer portal's give their own.
 */
export interface ContractNav {
  /** Whether the reader moved on to signing the contract. */
  sign: boolean;
  toList: () => void;
  toContract: (id: string) => void;
  toSign: (id: string) => void;
}
