import { requester } from '../utils/requster.js';
import { templates } from '../utils/templates.js';

export function DetailedExamsController(id) {
    let examUrl = `https://elsyser.herokuapp.com/api/exams/${id}/`,
        getData = requester.getJSON(examUrl),
        getTemplate = templates.get('detailed-exam');

    Promise.all([getData, getTemplate])
        .then((result) => {
            let data = result[0],
                hbTemplate = Handlebars.compile(result[1]),
                template = hbTemplate(data);
            
            $('#content').html(template);
        })
}