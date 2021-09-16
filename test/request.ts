import {HttpRequest} from '../src';

export class TestingForm extends HttpRequest {
    protected rules() {
        return {
            password: 'required|string|confirmed'
        }
    }
}

export class TestingAuth extends TestingForm {
    protected authorize(): Promise<boolean> {
        return new Promise(resolve => resolve(false))
    }
}
