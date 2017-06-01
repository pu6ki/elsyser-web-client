import { requester } from '../utils/requester.js';
import { templates } from '../utils/templates.js';
import { isTeacher } from '../utils/helper.js';
import { urls } from '../utils/urls.js';

export function homeController() {
    let token = window.localStorage.getItem('elsyser-token');

    if (token) {
        let newsUrl = isTeacher(token) ? urls.news.teachers : urls.news.students;

        let getExams = requester.getJSON(urls.exams),
            getNews = requester.getJSON(newsUrl),
            getHomeworks = requester.getJSON(urls.homeworks),
            getMaterials = requester.getJSON(urls.materials),
            getTemplate = templates.get('HomeTemplates/authorized-home');

        Promise.all([getTemplate, getNews, getExams, getHomeworks, getMaterials])
            .then((result) => {
                let data = {},
                    hbTemplate = Handlebars.compile(result[0]);

                data.news = result[1].slice(0, 5);
                data.exams = result[2].slice(0, 5);
                data.homeworks = result[3].slice(0, 5);
                data.materials = result[4].slice(0, 5);

                if (isTeacher(token)) {
                    data.isTeacher = true;
                }

                let template = hbTemplate(data);

                $('#content').html(template);
            })
            .catch((err) => {
                console.log(err);
            })
    } else {
        templates.get('HomeTemplates/unauthorized-home')
            .then((template) => {
                $('#content').html(template);
            });
    }
}
