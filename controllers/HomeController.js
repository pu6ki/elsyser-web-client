import { requester } from '../utils/requster.js';
import { templates } from '../utils/templates.js';
import { isTeacher } from '../utils/helper.js';

let token = window.localStorage.getItem('token');

export function HomeController() {
    if (token) {
        const url = 'https://elsyser.herokuapp.com/api/';
        if (!isTeacher(token)) {
            var getNews = requester.getJSON(url + 'news/');
        }
        let getExams = requester.getJSON(url + 'exams/'),
            getHomeworks = requester.getJSON(url + 'homeworks/'),
            getTemplate = templates.get('authorized-home');

        Promise.all([getTemplate, getNews, getExams, getHomeworks])
            .then((result) => {
                let data = {},
                    hbTemplate = Handlebars.compile(result[0]);

                if (!isTeacher(token)) {
                    data.news = result[1].slice(0, 5);
                }
                data.exams = result[2].slice(0, 5);
                data.homeworks = result[3].slice(0, 5);

                let template = hbTemplate(data);

                $('#content').html(template);

                if (isTeacher(token)) {
                    $('#news-panel').remove();
                }
            })
    } else {
        templates.get('unauthorized-home')
            .then((template) => {
                $('#content').html(template);
            });
    }
}

