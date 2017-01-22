import { requester } from '../../utils/requester.js';
import { templates } from '../../utils/templates.js';
import { validator } from '../../utils/validator.js';
import { DetailedHomeworkController } from './DetailedHomeworkController.js';

export function EditSubmissionController(homeworkId, submissionid) {
    let url = `https://elsyser.herokuapp.com/api/homeworks/${homeworkId}/submissions/${submissionid}/`,
        getData = requester.getJSON(url),
        getTemplate = templates.get('HomeworksTemplates/edit-submission');

    Promise.all([getData, getTemplate])
        .then((result) => {
            let data = result[0],
                hbTemplate = Handlebars.compile(result[1]),
                template = hbTemplate(data);

            $('#content').html(template);

            $('#edit-button').on('click', () => {
                let body = {
                    content: '',
                    solution_url: ''
                }

                if (validator.content($('#submission-content').val())) {
                    body.content = $('#submission-content').val();
                }
                else {
                    toastr.error('Content must contain atleast 5 characters.');
                }

                body.solution_url = $('#solution-url').val();

                requester.putJSON(url, body)
                    .then(() => {
                        toastr.success('Homework edited successfully!');
                        DetailedHomeworkController(homeworkId);
                    })
                    .catch((err) => {
                        console.log(err);
                        toastr.error('Couldn\'t edit homework.');
                    })
            })
        })
}