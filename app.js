import { controllers } from './controllers/controllers.js';
import { isTeacher, setNewsUrl } from './utils/helper.js';

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

window.onbeforeunload = controllers.header();

router
    .on('/', () => { router.navigate('/home') })
    .on('/home', () => {
        controllers.header();
        controllers.home();
    })
    .on('/about', () => {
        controllers.about();
    })
    .on('/login', () => {
        controllers.login();
    })
    .on('/register', () => {
        controllers.register();
    })
    .on('/profile/:id', (params) => {
        controllers.profile(params.id);
    })
    .on('/exams', () => {
        controllers.exams();
    })
    .on('/exams/:id', (params) => {
        controllers.detailedExam(params.id);
    })
    .on('/news/students/', () => {
        let newsUrl = setNewsUrl();
        controllers.news(newsUrl);
    })
    .on('/news/teachers/', () => {
        let newsUrl = setNewsUrl();
        controllers.news(newsUrl);
    })
    .on('/news/students/:id', (params) => {
        let newsUrl = setNewsUrl();
        controllers.detailedNews(newsUrl, params.id);
        let refreshId = setInterval(() => {
            controllers.loadComments(newsUrl, params.id);
            if (window.location.href !== `${domain}/#/news/students/${params.id}`) {
                clearInterval(refreshId);
            }
        }, 1000);
    })
    .on('/news/teachers/:id', (params) => {
        let newsUrl = setNewsUrl();
        controllers.detailedNews(newsUrl, params.id);
        let refreshId = setInterval(() => {
            controllers.loadComments(newsUrl, params.id);
            if (window.location.href !== `${domain}/#/news/teachers/${params.id}`) {
                clearInterval(refreshId);
            }
        }, 1000);
    })
    .on('/homeworks', () => {
        controllers.homeworks();
    })
    .on('/homeworks/:id', (params) => {
        controllers.detailedHomework(params.id);
    })
    .on('/homeworks/:id/submissions', (params) => {
        controllers.submission(params.id);
    })
    .on('/homeworks/:homeworkId/submissions/:submissionId', (params) => {
        controllers.detailedSubmission(params.homeworkId, params.submissionId);
    })
    .on('/materials', () => {
        controllers.materials();
    })
    .on('/materials/:subjectId/:materialId', (params) => {
        controllers.detailedMaterial(params.subjectId, params.materialId);
    })
    .on('/grades', () => {
        controllers.grades();
    })
    .on('/grades/:classNumber/:classLetter', (params) => {
        controllers.detailedClassGrades(params.classNumber, params.classLetter);
    })
    .notFound(() => {
        controllers.notFound();
    })
    .resolve();