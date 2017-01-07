import { requester } from '../../utils/requster.js';
import { templates } from '../../utils/templates.js';
import { validator } from '../../utils/validator.js';
import { insertLineBreaks } from '../../utils/helper.js';
import { DetailedHomeworkController } from './DetailedHomeworkController.js';

export function DetailedSubmissionController(homeworkId, submissionId) {
    let url = `https://elsyser.herokuapp.com/api/homeworks/${homeworkId}/submissions/${submissionId}/`,
        getData = requester.getJSON(url),
        getTemplate = templates.get('HomeworksTemplates/detailed-submission');

    Promise.all([getData, getTemplate])
        .then((result) => {
            let data = result[0],
                hbTemplate = Handlebars.compile(result[1]);
            
            if(data.student.user.username === window.localStorage.getItem('elsyser-username')) {
                data.editable = true;
            }
            data.content = insertLineBreaks(data.content);
            let template = hbTemplate(data);

            $('#content').html(template);

            $('#mark-checked').on('click', () => {
                let body = {
                    content: '',
                    solution_url: '',
                    checked: true
                }

                if (validator.content($('#submission-content').text())) {
                    body.content = $('#submission-content').text();
                }
                else {
                    toastr.error('Content must contain atleast 5 characters.');
                }

                body.solution_url = $('#solution-url').text();

                requester.putJSON(url, body)
                    .then(() => {
                        toastr.success('Homework marked as checked successfully!');
                        DetailedHomeworkController(homeworkId);
                    })
                    .catch((err) => {
                        console.log(err);
                        toastr.error('Couldn\'t marked as checked.');
                    })
            })
        })
}