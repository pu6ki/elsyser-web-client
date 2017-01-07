import { requester } from '../../utils/requster.js';
import { templates } from '../../utils/templates.js';
import { NotFoundController } from '../NotFoundController.js';

export function SubmissionsController(homeworkId) {
    let submissionsUrl = `https://elsyser.herokuapp.com/api/homeworks/${homeworkId}/submissions/`,
        getData = requester.getJSON(submissionsUrl),
        getTemplate = templates.get('HomeworksTemplates/submissions');

    Promise.all([getData, getTemplate])
        .then((result) => {
            let data = result[0],
                hbTemplate = Handlebars.compile(result[1]);

            data.forEach((el) => {
                if (el.content.length > 150) {
                    el.content = el.content.slice(0, 149) + '...';
                }
                el.homeworkId = homeworkId;
            })

            let template = hbTemplate(data);

            $('#content').html(template);
        })
        /*.catch((err) => {
            console.log(err);
            //NotFoundController();
        })*/
}