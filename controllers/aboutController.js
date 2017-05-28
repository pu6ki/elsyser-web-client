import { templates } from '../utils/templates.js';

export function aboutController() {
    templates.get('about')
        .then((template) => {
            $('#content').html(template);
        });
}
