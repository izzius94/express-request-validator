import * as Validator from 'validatorjs';
import {Rules, RegisterAsyncCallback} from 'validatorjs';
import {NextFunction, Request, Response} from 'express';
import { Exception } from './Exception';

export default abstract class {
    protected _code: number = 422;
    protected _body:{message: string, errors: {[key: string]: any}} = {message: 'Unprocessable entity', errors: {}}
    protected readonly _req: Request;
    protected readonly _res: Response;
    protected readonly _data:   any;
    protected readonly _rules: Rules;
    protected readonly _auth;
    protected readonly _asyncs: {name: string, fn: RegisterAsyncCallback, message: string}[] = []

    constructor(req: Request, res: Response, auth) {
        this._auth  = auth;
        this._res   = res;
        this._req   = req;
        this._rules = this.rules();
        this._data  = this.data();
    }

    protected data(): any {
        return this._req.body;
    }

    public validate(passes: Function, fails: Function): void {
        this._asyncs.forEach(rule => {
            Validator.registerAsync(rule.name, rule.fn, rule.message);
        });

        const validator = new Validator(this._data, this.rules());
        this._body.errors = validator.errors.errors;

        validator.checkAsync(this.after.bind(this, passes), fails.bind(this));
    }

    public fail(next: NextFunction): void {
        next(new Exception(this._code, this._body));
    }

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

    protected abstract rules(): Rules
}
