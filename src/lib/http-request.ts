import Validator from 'validatorjs';
import {Rules, RegisterAsyncCallback} from 'validatorjs';
import {NextFunction, Request, Response} from 'express';
import { Exception } from './exception';

/**
 * Class to handle express requests validating data and formatting the response
 */
export default abstract class {
    /** The response status code to send to the client */
    protected _code: number = 422;
    /** The response body to send to the client */
    protected _body:{message: string, errors: {[key: string]: any}} = {message: 'Unprocessable entity', errors: {}}
    /** The request sent by the client */
    protected readonly _req: Request;
    /** The response to send to the client */
    protected readonly _res: Response;
    /** The data used in the validation */
    protected readonly _data:   any;
    /** The rules to apply to the data */
    protected readonly _rules: Rules;
    /** User defined rules */
    protected readonly _asyncs: {name: string, fn: RegisterAsyncCallback, message: string}[] = []

    /**
     * Init the class
     * @param req The request sent by the client
     * @param res The response to send to the client
     */
    constructor(req: Request, res: Response) {
        this._res   = res;
        this._req   = req;
        this._rules = this.rules();
        this._data  = this.data();
    }

    /**
     * Method to set the data used by the validation, by default it uses _req.body
     * @returns The data used by the validation
     */
    protected data(): any {
        return this._req.body;
    }

    /**
     * Method to validate data.
     * It first register user defined rules, then validate the data
     * 
     * @param passes The callback used if validation passes
     * @param fails The callback used if validation fails
     */
    public validate(passes: Function, fails: Function): void {
        this._asyncs.forEach(rule => {
            Validator.registerAsync(rule.name, rule.fn, rule.message);
        });

        const validator = new Validator(this._data, this.rules());
        this._body.errors = validator.errors.errors;

        validator.checkAsync(this.after.bind(this, passes), fails.bind(this));
    }

    /**
     * Method used when a validation fails, it pass a new ValidationException
     * to the next method of express
     * 
     * @param next The next callable function of express
     */
    public fail(next: NextFunction): void {
        next(new Exception(this._code, this._body));
    }

    /**
     * Set data attached to the response
     * 
     * @returns The user defined 
     */
    protected attach() {
        return {}
    }

    /**
     * Method to add user defined actions after the validation succed
     */
    protected after(passes) {
        this._res.locals[this.constructor.name] = this.attach();
        passes();
    }

    /**
     * Method to set the validation rules
     */
    protected abstract rules(): Rules
}
