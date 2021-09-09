export class Exception extends Error {
    protected _code: number;
    protected _body: {[key: string]: any}

    constructor(code: number, body: {[key: string]: any}) {
        super('bfhbfg');
        this._code = code;
        this._body = body;
    }

    public get code() {
        return this._code;
    }

    public get body() {
        return this._body;
    }
}