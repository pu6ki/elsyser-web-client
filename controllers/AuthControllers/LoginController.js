import { requester } from '../../utils/requester.js';
import { templates } from '../../utils/templates.js';
import { formHandler } from '../../utils/formHandler.js';

export function LoginController() {
    templates.get('AuthTemplates/login')
        .then((res) => {
            let hbTemplate = Handlebars.compile(res),
                template = hbTemplate();

            $('#content').html(template);

            formHandler();

            $('#login-button').on('click', () => {
                login();
            });
        })
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
                localStorage.setItem('token', token);
                localStorage.setItem('elsyser-id', result.id);

                toastr.success('Logged-in successfully!');
                window.location.href = '/#/home';     
            }
        }).catch((err) => {
            console.log(err);
            toastr.error('Couldn\'t log-in with the provided credentials!');
        });
}
