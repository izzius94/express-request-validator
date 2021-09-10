import {Request, Response, NextFunction} from 'express';
import Req                               from './HttpRequest';

export default (Validation: IRequest) => {
    return function(req: Request, res: Response, next: NextFunction) {
        const v = new Validation(req, res.locals.auth, res);

        v.validate(next, v.fail.bind(v, next));
    }
}

interface IRequest {
    new (req: Request, res: Response, auth: any): Req
}
