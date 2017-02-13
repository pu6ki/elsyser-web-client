import { templates } from '../utils/templates.js';

export function AboutController() {
    templates.get('about')
        .then((template) => {
            $('#content').html(template);
        });
}
