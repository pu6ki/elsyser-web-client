import { requester } from '../utils/requster.js';
import { templates } from '../utils/templates.js';
import { LogoutController } from '../controllers/AuthControllers/LogoutController.js';
import { isTeacher } from '../utils/helper.js';

export function HeaderController() {
    const profileUrl = 'https://elsyser.herokuapp.com/api/profile/';
    const authHeader = 'authorized-header';
    const unauthHeader = 'unauthorized-header';
    let userData = {
        username: '',
        profileImage: ''
    };

    if (window.localStorage.getItem('token')) {
        requester.getJSON(profileUrl)
            .then((result) => {
                userData.profileImage = result.profile_image;
                userData.username = result.username || result.user.username;
                compileTemplate(authHeader, userData);
            });
    }
    else {
        compileTemplate(unauthHeader);
    }
}

function compileTemplate(template, data) {
    templates.get(template)
        .then((res) => {
            let hbTemplate = Handlebars.compile(res),
                template = hbTemplate(data);

            $('#header').html(template);

            if (window.localStorage.getItem('token')) {
                if (isTeacher(window.localStorage.getItem('token'))) {
                    $('#news-button').remove();
                }
            }

            $('#log-out').on('click', () => {
                LogoutController();
            })
        });
}
