import {HttpRequest} from '../src';

export default class Password extends HttpRequest {
    protected rules() {
        return {
            password: ['required', 'string', 'confirmed']
        }
    }
}
