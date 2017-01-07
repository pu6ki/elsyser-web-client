import { requester } from '../../utils/requster.js';
import { templates } from '../../utils/templates.js';

export function DetailedSubmissionController(homeworkId, submissionId) {  
    let url = `https://elsyser.herokuapp.com/api/homeworks/${homeworkId}/submissions/${submissionId}/`,
        getData = requester.getJSON(url),
        getTemplate = templates.get('HomeworksTemplates/detailed-submission');

    Promise.all([getData, getTemplate])
        .then((result) => {
            let data = result[0],
                hbTemplate = Handlebars.compile(result[1]),
                template = hbTemplate(data);

            $('#content').html(template);
        })
}