import * as express from 'express';
import axios from 'axios';
import {middleware} from '../src';
import Request from './Request';
import { Exception } from '../src/lib/Exception';

const app = express();

app.post('/', middleware(Request), (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        res.json(req);
    } catch (e) {
        next(e);
    }
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof Exception) {
        res.status(err.code).json(err.body);
    } else {
        console.log(err.constructor.name);
        res.status(500).json({message: "Something went wrong"});
    }
});

app.listen(3000, () => {
    console.log('Test server started');
    axios.post('http://127.0.0.1:3000', {password: 'ok'}).then((res) => {
        console.log('Test successed!')
    }).catch(e => {
    }).finally(() => {
        //process.exit();
    })
});