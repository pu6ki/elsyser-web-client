import { requester } from '../utils/requester.js';
import { templates } from '../utils/templates.js';
import { isTeacher } from '../utils/helper.js';
import { urls } from '../utils/urls.js';

import { auth } from '../controllers/authControllers.js';

export function headerController() {
    let profileId = localStorage.getItem('elsyser-id');
    const profileUrl = `${urls.profile}${profileId}/`;
    const authHeader = 'authorized-header';
    const unauthHeader = 'unauthorized-header';
    let token = window.localStorage.getItem('elsyser-token'); 
    let userData = {
        username: '',
        profileImage: '',
        profileId: null,
        isTeacher: isTeacher(token)
    };
    
    if (token) {
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

            $('#log-out').on('click', () => {
                auth.logout();
            })
        });
}
