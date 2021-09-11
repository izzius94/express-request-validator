# Express request validator
This library was inspired by Laravel Request validation and validatorjs
## Installation
### Using npm
```javascript
npm install @izzius94/express-request-validator
```
### Using yarn
```javascript
yarn add @izzius94/express-request-validator
```

## Usage

### Register the validation middleware
```javascript
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

```javascript
import {HttpRequest} from '../src';

export default class Password extends HttpRequest {
    protected rules() {
        return {
            password: ['required', 'string', 'confirmed']
        }
    }
}
```

### Register your custom rules
```
```

### Change date used by the validation
```
```

## Attach data to the response
```
```
