import { requester } from '../../utils/requester.js';
import { templates } from '../../utils/templates.js';
import { formHandler } from '../../utils/formHandler.js';
import { isTeacher, setTeacherSubjectToLocalStorage } from '../../utils/helper.js';

export function LoginController() {
    if (window.localStorage.getItem('elsyser-token') === null) {
        templates.get('AuthTemplates/login')
            .then((res) => {
                let hbTemplate = Handlebars.compile(res),
                    template = hbTemplate();

                $('#content').html(template);

                formHandler();

                $('#login-button').on('click', () => {
                    login();
                });
            });
    } else {
        window.location.href = '/#/home';
    }
}

function getDataFromTemplate() {
    let body = {
        email_or_username: '',
        password: ''
    };

    body.email_or_username = $('#email-or-username').val();
    body.password = $('#password').val();

    return body;
}

function login() {
    let loginUrl = 'https://elsyser.herokuapp.com/api/login/';
    requester.postJSON(loginUrl, getDataFromTemplate())
        .then((result) => {
            if (result.token) {
                let token = result.token;
                if (result.is_teacher) {
                    token += '1';
                }

                localStorage.setItem('elsyser-username', result.username);
                localStorage.setItem('elsyser-token', token);
                localStorage.setItem('elsyser-id', result.id);
                if (isTeacher(token)) {
                    setTeacherSubjectToLocalStorage();
                }

                toastr.success('Logged-in successfully!');
                window.location.href = '/#/home';
            }
        }).catch((err) => {
            console.log(err);
            toastr.error('Couldn\'t log-in with the provided credentials!');
        });
}
