import { requester } from './requester.js';

let templates = {
    get: function(name) {
        let url = `templates/${name}.handlebars`;
        return requester.get(url);
    }
};

export { templates };