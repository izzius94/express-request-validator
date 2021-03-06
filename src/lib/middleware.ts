import { Request, Response, NextFunction } from 'express'
import HttpRequest from './http-request'

export type IRequest = new (req: Request, res: Response) => HttpRequest

/**
 * Middleware used to validate a request using an instance
 * of HttpRequest Class
 *
 * @param Validation The HttpRequest class used to handle the request
 * @returns
 */
export default function (Validation: IRequest) {
  return function (req: Request, res: Response, next: NextFunction) {
    const v = new Validation(req, res)

    v.validate(next, v.fail.bind(v, next))
  }
}
