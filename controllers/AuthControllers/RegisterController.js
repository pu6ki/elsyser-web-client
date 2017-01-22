import { requester } from '../../utils/requester.js';
import { templates } from '../../utils/templates.js';
import { formHandler } from '../../utils/formHandler.js';
import { validator } from '../../utils/validator.js';

export function RegisterController() {
    templates.get('AuthTemplates/register')
        .then((res) => {
            let hbTemplate = Handlebars.compile(res),
                template = hbTemplate();

            $('#content').html(template);
            formHandler();

            $('#registerButton').on('click', () => {
                register();
            });
        });
}

function getDataFromTemplate() {
    let body = {
        user: {
            username: '',
            first_name: '',
            last_name: '',
            email: '',
            password: '',
        },
        clazz: {
            number: null,
            letter: ''
        }
    };

    if (validator.name($("#username").val())) {
        body.user.username = $("#username").val();
    }
    else {
        toastr.error('Username should be between 3 and 30 characters long!');
        return;
    }
    if (validator.name($('#firstName').val())) {
        body.user.first_name = $('#firstName').val();
    }
    else {
        toastr.error('First name shoud be between 3 and 30 characters long!');
        return;
    }
    if (validator.name($('#lastName').val())) {
        body.user.last_name = $('#lastName').val();
    }
    else {
        toastr.error('Last name shoud be between 3 and 30 characters long!');
        return;
    }
    if (validator.email($('#email').val())) {
        body.user.email = $('#email').val();
    }
    else {
        toastr.error('Email should be valid!');
        return;
    }
    if (validator.password($('#password').val())) {
        body.user.password = $('#password').val();
    }
    else {
        toastr.error('Password must be between 6 and 16 characters long and contain atleast one number!');
        return;
    }

    body.clazz.number = +$('#studentClassNumber').val();
    body.clazz.letter = $('#studentClassLetter').val();

    return body;
}

function register() {
    let registerUrl = 'https://elsyser.herokuapp.com/api/register/';
    let data = getDataFromTemplate();
    if (data) {
        requester.postJSON(registerUrl, data)
            .then((result) => {
                if (result) {
                    toastr.success('Registered successfully! Now you can log-in!');
                    window.location.href = '#/login';
                }
            }).catch((error) => {
                toastr.error(`Couldn\'t register with the provided info! ${error.responseText}`);
            });
    }
}
