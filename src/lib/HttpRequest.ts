import Validator from 'validatorjs';
import {Rules, RegisterAsyncCallback} from 'validatorjs';
import {NextFunction, Request, Response} from 'express';
import { Exception } from './Exception';

export default abstract class {
    protected _code: number = 422;
    protected _body:{message: string, errors: {[key: string]: any}} = {message: 'Unprocessable entity', errors: {}}
    /** The request sent by the client */
    protected readonly _req: Request;
    /** The response to send to the client */
    protected readonly _res: Response;
    /** The data used in the validation */
    protected readonly _data:   any;
    /** The rules to apply to the data */
    protected readonly _rules: Rules;
    protected readonly _auth;
    /** User defined rules */
    protected readonly _asyncs: {name: string, fn: RegisterAsyncCallback, message: string}[] = []

    constructor(req: Request, res: Response, auth) {
        this._auth  = auth;
        this._res   = res;
        this._req   = req;
        this._rules = this.rules();
        this._data  = this.data();
    }

    /**
     * Method to set the data to validate
     * @returns The data to validate
     */
    protected data(): any {
        return this._req.body;
    }

    /**
     * Method to validate data
     * @param passes 
     * @param fails 
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
     * Validation failed
     * @param next The next callable function of express
     */
    public fail(next: NextFunction): void {
        next(new Exception(this._code, this._body));
    }

    /**
     * Set data attached to the response
     * @returns 
     */
    protected attach() {
        return {}
    }

    /**
     * What todo after data checking passes
     */
    protected after(passes) {
        this._res.locals[this.constructor.name] = this.attach();
        passes();
    }

    /**
     * Use this method to write your rules
     */
    protected abstract rules(): Rules
}
