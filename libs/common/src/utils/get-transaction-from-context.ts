import { TRANSACTION_FIELD } from '../constants';

export function getTransactionFromContext(context: any) {
  const req = context?.req;
  if (!req) {
    return null;
  }
  return req[TRANSACTION_FIELD];
}
