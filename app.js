import { HeaderController } from './controllers/HeaderController.js';
import { HomeController } from './controllers/HomeController.js';
import { AboutController } from './controllers/AboutController.js';

import { LoginController } from './controllers/AuthControllers/LoginController.js';
import { RegisterController } from './controllers/AuthControllers/RegisterController.js';

import { ProfileController } from './controllers/ProfileControllers/ProfileController.js';
import { EditProfileController } from './controllers/ProfileControllers/EditProfileController.js';

import { ExamsController } from './controllers/ExamsControllers/ExamsController.js';
import { DetailedExamsController } from './controllers/ExamsControllers/DetailedExamsController.js';

import { NewsController } from './controllers/NewsControllers/NewsController.js';
import { AddNewsController } from './controllers/NewsControllers/AddNewsController.js';
import { DetailedNewsController, loadComments } from './controllers/NewsControllers/DetailedNewsController.js';

import { DetailedHomeworkController } from './controllers/HomeworksControllers/DetailedHomeworkController.js';
import { HomeworksController } from './controllers/HomeworksControllers/HomeworksController.js';

import { MaterialsController } from './controllers/MaterialsControllers/MaterialsController.js';
import { DetailedMaterialController } from './controllers/MaterialsControllers/DetailedMaterialController.js';

import { NotFoundController } from './controllers/NotFoundController.js';


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
    .on('/profile/:id', (params) => {
        ProfileController(params.id);
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
    .on('/homeworks', () => {
        HomeworksController();
    })
    .on('/homeworks/:id', (params) => {
        DetailedHomeworkController(params.id);
    })
    .on('/materials', () => {
        MaterialsController();
    })
    .on('/materials/:subjectId/:materialId', (params) => {
        DetailedMaterialController(params.subjectId, params.materialId);
    })
    .notFound(() => {
        NotFoundController();
    })
    .resolve();