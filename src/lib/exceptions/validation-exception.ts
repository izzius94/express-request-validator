import { Validator } from 'validatorjs'

/**
 * Exception rised when a request validation fails
 */
export class ValidationException extends Error {
  protected _code: number
  protected _body: {[key: string]: any}
  /** The validator that rised the exception */
  protected _validator: Validator<any>

  constructor (code: number, body: {[key: string]: any}, validator?: Validator<any>) {
    super()
    this._code = code
    this._body = body

    if (validator !== undefined) {
      this._validator = validator
    }

    Object.setPrototypeOf(this, ValidationException.prototype)
  }

  public get code (): number {
    return this._code
  }

  public get body (): {[key: string]: any} {
    return this._body
  }

  public get validator (): Validator<any> {
    return this._validator
  }
}
