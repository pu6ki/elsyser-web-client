import { HeaderController } from './controllers/HeaderController.js';
import { HomeController } from './controllers/HomeController.js';
import { AboutController } from './controllers/AboutController.js';

import { LoginController } from './controllers/AuthControllers/LoginController.js';
import { RegisterController } from './controllers/AuthControllers/RegisterController.js';

import { ProfileController } from './controllers/ProfileController.js';
import { EditProfileController } from './controllers/EditProfileController.js';

import { ExamsController } from './controllers/ExamsControllers/ExamsController.js';
import { DetailedExamsController } from './controllers/ExamsControllers/DetailedExamsController.js';

import { NewsController } from './controllers/NewsControllers/NewsController.js';
import { AddNewsController } from './controllers/NewsControllers/AddNewsController.js';
import { DetailedNewsController, loadComments } from './controllers/NewsControllers/DetailedNewsController.js';

import { DetailedHomeworkController } from './controllers/HomeworksControllers/DetailedHomeworkController.js';
import { HomeworksController } from './controllers/HomeworksControllers/HomeworksController.js';

try {
    HandlebarsIntl.registerWith(Handlebars);
} catch (error) {
    let toastrOptions = {
        "timeOut": "5000000",
        "positionClass": "toast-top-center"
    }
    toastr.warning('If you have opened this page on mobile device, please use Google Chrome for your mobile OS!', 'Warning', toastrOptions);
}

const domain = 'http://127.0.0.1:8080';

var router = new Navigo(null, true);

window.onbeforeunload = HeaderController();

router
    .on('/', () => { router.navigate('/home') })
    .on('/home', () => {
        HeaderController();
        HomeController();
    })
    .on('/about', () => {
        AboutController();
    })
    .on('/login', () => {
        LoginController();
    })
    .on('/register', () => {
        RegisterController();
    })
    .on('/profile', () => {
        ProfileController();
    })
    .on('/profile/edit', () => {
        EditProfileController();
    })
    .on('/exams', () => {
        ExamsController();
    })
    .on('/exams/:id', (params) => {
        DetailedExamsController(params.id);
    })
    .on('/news', () => {
        NewsController();
    })
    .on('/news/:id', (params) => {
        DetailedNewsController(params.id);
        let refreshId = setInterval(() => {
            loadComments(params.id);
            if (window.location.href !== `${domain}/#/news/${params.id}`) {
                clearInterval(refreshId);
            }
        }, 1000);
    })
    .on('/add-news', () => {
        AddNewsController();
    })
    .on('/news/:id/delete', (params) => {
        DeleteNewsController(params.id);
    })
    .on('/homeworks', () => {
        HomeworksController();
    })
    .on('/homeworks/:id', (params) => {
        DetailedHomeworkController(params.id);
    })
    .resolve();