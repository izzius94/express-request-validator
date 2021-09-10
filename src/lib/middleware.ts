import {Request, Response, NextFunction} from 'express';
import Req                               from './HttpRequest';

/**
 * Middleware to validate an instance of HttpRequest Class
 */
export default (Validation: IRequest) => {
    return function(req: Request, res: Response, next: NextFunction) {
        const v = new Validation(req, res, res.locals.auth);

        v.validate(next, v.fail.bind(v, next));
    }
}

export interface IRequest {
    new (req: Request, res: Response, auth: any): Req
}
