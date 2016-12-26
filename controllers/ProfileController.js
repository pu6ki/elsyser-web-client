import { requester } from '../utils/requster.js';
import { templates } from '../utils/templates.js';
import { EditProfileController } from './EditProfileController.js';

export function ProfileController() {
    let profileUrl = 'https://elsyser.herokuapp.com/api/profile/',
        getData = requester.getJSON(profileUrl),
        getTemplate = templates.get('profile');

    Promise.all([getData, getTemplate])
        .then((result) => {
            let data = result[0],
                hbTemplate = Handlebars.compile(result[1]),
                template = hbTemplate(data);

            $('#content').html(template);
            $('#edit-profile').on('click', () => {
                EditProfileController();
            });
        }).catch((err) => {
            console.log(err);
        });
}
