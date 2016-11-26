import { requester } from '../../utils/requster.js';
import { templates } from '../../utils/templates.js';

export function DetailedHomeworkController(id) {
    let examUrl = `https://elsyser.herokuapp.com/api/homeworks/${id}/`,
        getData = requester.getJSON(examUrl),
        getTemplate = templates.get('detailed-homework');

    Promise.all([getData, getTemplate])
        .then((result) => {
            let data = result[0],
                hbTemplate = Handlebars.compile(result[1]),
                template = hbTemplate(data);

            $('#content').html(template);
        });
}