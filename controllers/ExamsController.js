import { requester } from '../utils/requster.js';
import { templates } from '../utils/templates.js';

export function ExamsController() {
    let examsUrl = 'https://elsyser.herokuapp.com/api/exams/',
        getData = requester.getJSON(examsUrl),
        getTemplate = templates.get('exams');

    Promise.all([getData, getTemplate])
        .then((result) => {
            let data = result[0],
                hbTemplate = Handlebars.compile(result[1]);
                
            data.forEach((el) => {
                if (el.details.length > 150) {
                    el.details = el.details.slice(0, 149) + '...';
                }
            });

            let template = hbTemplate(data);
            $('#content').html(template);
        }).catch((err) => {
            console.log(err);
        });
}
