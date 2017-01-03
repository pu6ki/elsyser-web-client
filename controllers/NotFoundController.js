import { requester } from '../utils/requster.js';
import { templates } from '../utils/templates.js';

export function NotFoundController() {
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