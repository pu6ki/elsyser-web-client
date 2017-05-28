import { requester } from '../utils/requester.js';
import { templates } from '../utils/templates.js';

export function notFoundController() {
    templates.get('404-error')
        .then((result) => {
            let hbTemplate = Handlebars.compile(result),
                template = hbTemplate();

            $('#content').html(template);

            $('#go-home-button').on('click', () => {
                window.location.href = '#/home'
            })
        })
}