import {HttpRequest} from '../src';

export default class Password extends HttpRequest {
    protected rules() {
        return {
            password:   ['required', 'string', 'confirmed', 'regex:^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$']
        }
    }
}
