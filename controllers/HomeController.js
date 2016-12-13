import { requester } from '../utils/requster.js';
import { templates } from '../utils/templates.js';

export function HomeController() {
    if (window.localStorage.getItem('token')) {
        const url = 'https://elsyser.herokuapp.com/api/';
        let getNews = requester.getJSON(url + 'news/'),
            getExams = requester.getJSON(url + 'exams/'),
            getHomeworks = requester.getJSON(url + 'homeworks/'),
            getTemplate = templates.get('authorized-home');

        Promise.all([getTemplate, getNews, getExams, getHomeworks])
            .then((result) => {
                let data = {},
                    hbTemplate = Handlebars.compile(result[0])
                data.news = result[1].slice(0, 5);
                data.exams = result[2].slice(0, 5);
                data.homeworks = result[3].slice(0, 5);

                let template = hbTemplate(data);

                $('#content').html(template);
            })
    } else {
        templates.get('unauthorized-home')
            .then((template) => {
                $('#content').html(template);
            });
    }
}
