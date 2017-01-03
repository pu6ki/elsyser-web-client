import { requester } from '../utils/requster.js';
import { templates } from '../utils/templates.js';
import { isTeacher } from '../utils/helper.js';

export function HomeController() {
    let token = window.localStorage.getItem('token');

    if (token) {
        const url = 'https://elsyser.herokuapp.com/api/';
        if (!isTeacher(token)) {
            var getNews = requester.getJSON(url + 'news/');
        }
        let getExams = requester.getJSON(url + 'exams/'),
            getHomeworks = requester.getJSON(url + 'homeworks/'),
            getMaterials = requester.getJSON(url + 'materials/'),
            getTemplate = templates.get('HomeTemplates/authorized-home');

        Promise.all([getTemplate, getNews, getExams, getHomeworks, getMaterials])
            .then((result) => {
                let data = {},
                    hbTemplate = Handlebars.compile(result[0]);

                if (!isTeacher(token)) {
                    data.news = result[1].slice(0, 5);
                }
                data.exams = result[2].slice(0, 5);
                data.homeworks = result[3].slice(0, 5);
                data.materials = result[4].slice(0, 5);

                let template = hbTemplate(data);

                $('#content').html(template);

                if (isTeacher(token)) {
                    $('#news-panel').remove();
                }
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

