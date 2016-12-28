import { requester } from '../../utils/requster.js';
import { templates } from '../../utils/templates.js';
import { formHandler } from '../../utils/formHandler.js';
import { AddHomeworkController } from './AddHomeworkController.js'

export function HomeworksController() {
    const homeworksUrl = 'https://elsyser.herokuapp.com/api/homeworks/';

    let getData = requester.getJSON(homeworksUrl),
        getTemplate = templates.get('HomeworksTemplates/homeworks');

    Promise.all([getData, getTemplate])
        .then((result) => {
            let data = result[0],
                hbTemplate = Handlebars.compile(result[1]),
                isTeacher = false,
                token = window.localStorage.getItem('token');

            data.forEach((el) => {
                if (el.details.length > 150) {
                    el.details = el.details.slice(0, 149) + '...';
                }
            });

            if (token.length === 41 && token[40] === '1') {
                isTeacher = true;
            }

            let template = hbTemplate({ homeworks: data, isTeacher: isTeacher });
            $('#content').html(template);

            $('#add-homework').on('click', () => {
                AddHomeworkController();
            })
        }).catch((err) => {
            console.log(err);
        });
}
