import { requester } from '../utils/requester.js';
import { templates } from '../utils/templates.js';
import { formHandler } from '../utils/formHandler.js';
import { isTeacher, setTeacherSubjectToLocalStorage } from '../utils/helper.js';
import { validator } from '../utils/validator.js';
import { urls } from '../utils/urls.js';

import { headerController } from './headerController.js';
import { homeController } from './homeController.js';

function loginController() {
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

function getDataFromLoginTemplate() {
    let body = {
        email_or_username: '',
        password: ''
    };

    body.email_or_username = $('#email-or-username').val();
    body.password = $('#password').val();

    return body;
}

function login() {
    requester.postJSON(urls.auth.login, getDataFromLoginTemplate())
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
            //console.log(err);
            toastr.error('Couldn\'t log-in with the provided credentials!');
        });
}

function registerController() {
    if (window.localStorage.getItem('elsyser-token') === null) {
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
    } else {
        window.location.href = "/#/home";
    }
}

function getDataFromRegisterTemplate() {
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
    let data = getDataFromRegisterTemplate();
    if (data) {
        requester.postJSON(urls.auth.register, data)
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

function logoutController() {
    toastr.success('Logged-out successfully!');
    localStorage.removeItem('elsyser-token');
    localStorage.removeItem('elsyser-username');
    localStorage.removeItem('elsyser-id');
    localStorage.removeItem('elsyser-teachers-subject-id');
    headerController();
    if (window.location.href === '/#/home') {
        homeController();
    } else {
        window.location.href = '/#/home';
        homeController();
    }
}


export let auth = {
  register: registerController,
  login: loginController,
  logout: logoutController
}