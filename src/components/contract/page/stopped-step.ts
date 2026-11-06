import type { Step } from '@/components/contract/steps';
import type { ContractType } from '@/queries/contract/type';

/** Whether contract was cancelled or expired. */
export function contractEnded(contract: ContractType): boolean {
  return contract.status === 'cancelled' || contract.status === 'expired';
}

/**
 * The step a stored contract's page marks: where a cancelled or expired one stopped, at
 * paying when it was never paid and at signing when it was, otherwise the last one.
 */
export function stoppedStep(contract: ContractType): Step {
  if (!contractEnded(contract)) {
    return 'done';
  }
  return contract.paid_on ? 'sign' : 'pay';
}
