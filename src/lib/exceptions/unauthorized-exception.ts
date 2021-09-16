import { ValidationException } from './validation-exception'

/**
 * Exception rised when a request is not authorized
 */
export class UnauthorizedException extends ValidationException {
  constructor (code: number, body: {message: string}) {
    super(code, body)
    Object.setPrototypeOf(this, UnauthorizedException.prototype)
  }
}
