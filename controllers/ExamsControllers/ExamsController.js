import { requester } from '../../utils/requster.js';
import { templates } from '../../utils/templates.js';
import { isTeacher } from '../../utils/helper.js';
import { formHandler } from '../../utils/formHandler.js';
import { AddExamController } from './AddExamController.js';

export function ExamsController() {
    const examsUrl = 'https://elsyser.herokuapp.com/api/exams/';

    let getData = requester.getJSON(examsUrl),
        getTemplate = templates.get('ExamsTemplates/exams');

    Promise.all([getData, getTemplate])
        .then((result) => {
            let data = result[0],
                hbTemplate = Handlebars.compile(result[1]),
                token = window.localStorage.getItem('token');

            data.forEach((el) => {
                if (el.details.length > 150) {
                    el.details = el.details.slice(0, 149) + '...';
                }
            });

            let template = hbTemplate({ exams: data, isTeacher: isTeacher(token) });
            $('#content').html(template);

            $('#add-exam').on('click', () => {
                AddExamController();
            })
        }).catch((err) => {
            console.log(err);
        });
}
