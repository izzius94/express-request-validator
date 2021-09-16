[![npm version](https://badge.fury.io/js/@izzius94%2Fexpress-request-validator.svg)](https://badge.fury.io/js/@izzius94%2Fexpress-request-validator)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# Express request validator
This library was inspired by Laravel Request validation and validatorjs

## Installation

**Using npm**
```
npm install @izzius94/express-request-validator
```

**Using yarn**
```
yarn add @izzius94/express-request-validator
```

## Basic Usage

### Create your validation class
```typescript
import {HttpRequest} from '@izzius94/express-request-validator';

export default class Password extends HttpRequest {
    protected rules() {
        return {
            password: 'required|string|confirmed'
        }
    }
}
```

Define your rules in the returned object.

### Register the validation middleware
```typescript
import express from 'express';
import validate from 'express-request-validator';
import MyValidation from './validations/MyValidation';

const app = express();

// Registering the middleware
app.post('/', validate(MyValidation), (req, res) => {
    res.json(req.body);
});

app.listen(process.env.APP_PORT, () => {
    console.log(`Server started`);
});

```

You are ready to go!


See the full documentation [here](https://gitlab.com/izzius94/express-request-validator/-/wikis/Home).
