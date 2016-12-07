import { requester } from '../utils/requster.js';
import { templates } from '../utils/templates.js';

export function HomeController() {
    if (window.localStorage.getItem('token')) {
        templates.get('authorized-home')
            .then((template) => {
                $('#content').html(template);
            });
    } else {
        templates.get('unauthorized-home')
            .then((template) => {
                $('#content').html(template);
            });
    }
}
