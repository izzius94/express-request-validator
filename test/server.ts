import express from 'express';
import { middleware, ValidationException } from '../src';
import * as requests from './request';
import {json} from 'body-parser';

const app = express();
app.use(json());

app.post('/', middleware(requests.TestingForm), (req: express.Request, res: express.Response) => {
    res.json(req.body);
})

app.post('/auth', middleware(requests.TestingAuth), (req: express.Request, res: express.Response) => {
    res.json(req.body);
})

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof ValidationException) {
        res.status(err.code).json(err.body)
    } else {
        res.status(500).json({message: "Something went wrong"})
    }
})

app.listen(3000, () => {
    console.log(`Server started on port 3000`)
})

export default app