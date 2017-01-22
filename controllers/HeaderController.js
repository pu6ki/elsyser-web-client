import { requester } from '../utils/requester.js';
import { templates } from '../utils/templates.js';
import { LogoutController } from '../controllers/AuthControllers/LogoutController.js';
import { isTeacher } from '../utils/helper.js';

export function HeaderController() {
    let profileId = localStorage.getItem('elsyser-id');
    const profileUrl = `https://elsyser.herokuapp.com/api/profile/${profileId}/`;
    const authHeader = 'authorized-header';
    const unauthHeader = 'unauthorized-header';
    let userData = {
        username: '',
        profileImage: '',
        profileId: null
    };

    if (window.localStorage.getItem('token')) {
        requester.getJSON(profileUrl)
            .then((result) => {
                userData.profileImageUrl = result.profile_image_url;
                userData.username = result.username || result.user.username;
                userData.profileId = localStorage.getItem('elsyser-id');
                compileTemplate(authHeader, userData);
            });
    }
    else {
        compileTemplate(unauthHeader);
    }
}

function compileTemplate(template, data) {
    templates.get('HeaderTemplates/' + template)
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
