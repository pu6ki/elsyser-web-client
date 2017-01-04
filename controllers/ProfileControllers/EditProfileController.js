import { requester } from '../../utils/requster.js';
import { templates } from '../../utils/templates.js';
import { validator } from '../../utils/validator.js';
import { isTeacher } from '../../utils/helper.js';
import { ProfileController } from './ProfileController.js';
import { HeaderController } from '../HeaderController.js'

let profileId = localStorage.getItem('elsyser-id');
const profileUrl = `https://elsyser.herokuapp.com/api/profile/${profileId}/`;

export function EditProfileController() {
    let getData = requester.getJSON(profileUrl),
        getTemplate = templates.get('ProfileTemplates/edit-profile');

    Promise.all([getData, getTemplate])
        .then((result) => {
            let data = result[0],
                hbTemplate = Handlebars.compile(result[1]),
                template = hbTemplate(data);

            $('#content').html(template);

            $('#save-button').on('click', () => {
                editData();
            });
        });
}

function editData() {
    if (isTeacher(window.localStorage.getItem('token'))) {
        var body = {
            username: '',
            first_name: '',
            last_name: ''
        }

        if (validator.name($('#new-username').val())) {
            body.username = $('#new-username').val();
        }
        else {
            toastr.error('Username should be between 3 and 30 characters long.');
            return;
        }
        if (validator.name($('#new-first-name').val())) {
            body.first_name = $('#new-first-name').val();
        }
        else {
            toastr.error('First name shoud be between 3 and 30 characters long.');
            return;
        }
        if (validator.name($('#new-last-name').val())) {
            body.last_name = $('#new-last-name').val();
        }
        else {
            toastr.error('Last name shoud be between 3 and 30 characters long.');
            return;
        }

        requester.putJSON(profileUrl, body)
            .then(() => {
                toastr.success('Data updated successfully.');
                ProfileController(profileId);
            }).catch((error) => {
                toastr.error('Student with this username already exists.');
            });
    }
    else {
        var body = {
            user: {
                username: '',
                first_name: '',
                last_name: ''
            },
            info: '',
            profile_image_url: ''
        };

        if (validator.name($('#new-username').val())) {
            body.user.username = $('#new-username').val();
        }
        else {
            toastr.error('Username should be between 3 and 30 characters long.');
            return;
        }
        if (validator.name($('#new-first-name').val())) {
            body.user.first_name = $('#new-first-name').val();
        }
        else {
            toastr.error('First name shoud be between 3 and 30 characters long.');
            return;
        }
        if (validator.name($('#new-last-name').val())) {
            body.user.last_name = $('#new-last-name').val();
        }
        else {
            toastr.error('Last name shoud be between 3 and 30 characters long.');
            return;
        }

        body.info = $('#new-info').val();
        body.profile_image_url = $('#new-profile-image-url').val() || 'http://elsyser.herokuapp.com/static/default.png';

        requester.putJSON(profileUrl, body)
            .then(() => {
                toastr.success('Data updated successfully.');
                ProfileController(profileId);
                HeaderController();
            }).catch((error) => {
                toastr.error(error.responseText);
            });
    }
}
