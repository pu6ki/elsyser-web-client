import { requester } from '../utils/requester.js';
import { templates } from '../utils/templates.js';
import { validator } from '../utils/validator.js';
import { urls } from '../utils/urls.js';

import { notFoundController } from './notFoundController.js';
import { headerController } from './headerController.js'

export function profileController(id) {
    let profileUrl = `${urls.profile}${id}/`,
        getData = requester.getJSON(profileUrl),
        getTemplate = templates.get('ProfileTemplates/profile');

    Promise.all([getData, getTemplate])
        .then((result) => {
            let data = result[0],
                hbTemplate = Handlebars.compile(result[1]),
                template = hbTemplate(data);

            $('#content').html(template);
            $('#edit-profile').on('click', () => {
                editProfileController(id);
            });
        }).catch((err) => {
            notFoundController();
            console.log(err);
        });
}

function editProfileController(id) {
    let getData = requester.getJSON(`${urls.profile}${id}/`),
        getTemplate = templates.get('ProfileTemplates/edit-profile');

    Promise.all([getData, getTemplate])
        .then((result) => {
            let data = result[0],
                hbTemplate = Handlebars.compile(result[1]),
                template = hbTemplate(data);

            $('#content').html(template);

            $('#save-button').on('click', () => {
                editData(id);
            });
        });
}

function editData(id) {
    var body = {
        user: {
            username: '',
            first_name: '',
            last_name: ''
        },
        info: '',
        profile_image_url: '',
    }

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
    body.profile_image_url = $('#new-profile-image-url').val();

    requester.putJSON(`${urls.profile}${id}/`, body)
        .then(() => {
            toastr.success('Data updated successfully.');
            profileController(id);
            headerController();
        }).catch((error) => {
            toastr.error(error.responseText);
        });
}
