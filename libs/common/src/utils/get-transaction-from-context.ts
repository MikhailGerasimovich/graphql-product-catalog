import { TRANSACTION_FIELD } from '../constants';

export function getTransactionFromContext(context: any) {
  const req = context?.req;

  return req[TRANSACTION_FIELD];
}
