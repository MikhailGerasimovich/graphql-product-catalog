import { Response } from 'express';

export function setCookie(res: Response, cookieName: string, cookieData: any): void {
  res.cookie(cookieName, cookieData, { httpOnly: true, sameSite: true });
}
