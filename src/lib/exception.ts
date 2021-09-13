/**
 * Exception rised when a request validation fails
 */
export class Exception extends Error {
  protected _code: number
  protected _body: {[key: string]: any}

  constructor (code: number, body: {[key: string]: any}) {
    super()
    this._code = code
    this._body = body

    Object.setPrototypeOf(this, Exception.prototype)
  }

  public get code (): number {
    return this._code
  }

  public get body (): {[key: string]: any} {
    return this._body
  }
}
