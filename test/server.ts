import express from 'express';
import {middleware} from '../src';
import Request from './Request';
import { Exception } from '../src/lib/Exception';
import {json} from 'body-parser';

const app = express();
app.use(json());

app.post('/', middleware(Request), (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        res.json(req.body);
    } catch (e) {
        next(e);
    }
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof Exception) {
        res.status(err.code).json(err.body);
    } else {
        console.log(err);
        res.status(500).json({message: "Something went wrong"});
    }
});

app.listen(3000, () => {
    console.log(`Server started on port 3000`);
});

export default app;