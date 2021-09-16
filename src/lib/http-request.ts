import Validator, { Rules, RegisterAsyncCallback, ErrorMessages, AttributeNames } from 'validatorjs'
import { NextFunction, Request, Response } from 'express'
import { ValidationException } from './exceptions/validation-exception'
import { UnauthorizedException } from './exceptions/unauthorized-exception'

/**
 * Define the structure of a user defined rule
 */
interface UserRule {
  name: string
  fn: RegisterAsyncCallback
  message: string
}

/**
 * Class to handle express requests validating data and formatting the response
 */
export default abstract class HttpRequest {
  /** The response status code to send to the client if the request is not valid */
  protected _code: number = 422
  /** The response body to send to the client */
  protected _body: {message: string, errors: {[key: string]: any}} = { message: 'Unprocessable entity', errors: {} }
  /** Set if the request is authorized */
  protected _authorized: boolean = true
  /** The response status code to send to the client if the request is not authorized */
  protected _unauthCode: number = 401
  /** The response body to send to the client if the request is not authorized */
  protected _unauthBody: {message: string} = { message: 'Unauthorized' }
  /** The request sent by the client */
  protected readonly _req: Request
  /** The response to send to the client */
  protected readonly _res: Response
  /** The data used in the validation */
  protected readonly _data: any
  /** The rules to apply to the data */
  protected readonly _rules: Rules
  /** User defined rules */
  protected readonly _userRules: UserRule[] = []
  /** Set the validator language */
  protected readonly _lang: string = 'en'

  /**
   * Init the class
   * @param req The request sent by the client
   * @param res The response to send to the client
   */
  constructor (req: Request, res: Response) {
    this._res = res
    this._req = req
    this._rules = this.rules()
    this._data = this.data()
  }

  /**
   * Method to set the data used by the validation, by default it uses _req.body
   *
   * @returns The data used by the validation
   */
  protected data (): any {
    return this._req.body
  }

  /**
   * Method to validate data.
   * It first register user defined rules, then validate the data
   *
   * @param passes The callback used if validation passes
   * @param fails The callback used if validation fails
   */
  public validate (passes: NextFunction, fails: Function): void {
    this.authorize().then(res => {
      if (res) {
        this._userRules.forEach(this.registerRule)

        const validator = new Validator(this._data, this.rules(), this.messages())
        Validator.useLang(this._lang)
        validator.setAttributeNames(this.attributes())
        this._body.errors = validator.errors.errors

        validator.checkAsync(this.after.bind(this, passes), fails.bind(this, validator))
      } else {
        this._authorized = false
        this.fail(passes)
      }
    }).catch(e => {
      throw (e)
    })
  }

  /**
   * Method used when a request fails to authorize or to validate
   * it passes the exception to the next() method of express
   *
   * @param next The next callable function of express
   */
  public fail (next: NextFunction, validator?: Validator.Validator<any>): void {
    if (this._authorized) {
      next(new ValidationException(this._code, this._body, validator))
    } else {
      next(new UnauthorizedException(this._unauthCode, this._unauthBody))
    }
  }

  /**
   * Check if the current request is authorized
   *
   * @returns Determine if the request is authorized or not
   */
  protected async authorize (): Promise<boolean> {
    return true
  }

  /**
   * Add a user defined rule to the validation
   *
   * @param rule The rule to apply in the validation
   */
  protected registerRule (rule: UserRule): void {
    Validator.registerAsync(rule.name, rule.fn, rule.message)
  }

  /**
   * Set data attached to the response
   *
   * @returns The user defined data
   */
  protected attach (): {[key: string]: any} {
    return {}
  }

  /**
   * Method to add user defined actions after the validation succed
   *
   * @param passes The function to call when validation passes
   */
  protected after (passes: Function): void {
    this._res.locals[this.constructor.name] = this.attach()
    passes()
  }

  /**
   * Define custom error messages for the validation
   *
   * @returns User defined error messages for the validation
   */
  protected messages (): ErrorMessages {
    return {}
  }

  /**
   * Get custom attributes for validation errors.
   *
   * @returns User defined attributes for validation errors
   */
  protected attributes (): AttributeNames {
    return {}
  }

  /**
   * Method to set the validation rules
   */
  protected abstract rules (): Rules
}
