import { requester } from '../../utils/requester.js';
import { templates } from '../../utils/templates.js';
import { validator } from '../../utils/validator.js';

import { DetailedHomeworkController } from './DetailedHomeworkController.js';
import { HomeworksController } from './HomeworksController.js'

export function SendHomeworkController(homeworkId) {
    let url = `https://elsyser.herokuapp.com/api/homeworks/${homeworkId}/submissions/`;

    templates.get('HomeworksTemplates/send-homework')
        .then((result) => {
            let hbTemplate = Handlebars.compile(result),
                template = hbTemplate();

            $('#content').html(template);

            $('#send-button').on('click', (homeworkId) => {
                let body = {
                    content: '',
                    solution_url: ''
                }

                if(validator.content($('#submission-content').val())) {
                    body.content = $('#submission-content').val();
                }
                else {
                    toastr.error('Content must contain atleast 5 characters.');
                    return;
                }

                body.solution_url = $('#solution-url').val();

                requester.postJSON(url, body)
                    .then(() => {
                        toastr.success('Homework sent successfully!');
                        HomeworksController();
                    })
                    .catch((err) => {
                        console.log(err);
                        toastr.error('Couldn\'t send homework.');
                    })
            });

            $('#go-back').on('click', () => {
                DetailedHomeworkController(homeworkId);
            })
        });
}
