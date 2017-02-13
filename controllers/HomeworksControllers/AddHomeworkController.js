import { requester } from '../../utils/requester.js';
import { templates } from '../../utils/templates.js';
import { formHandler } from '../../utils/formHandler.js';

import { HomeworksController } from './HomeworksController.js';

export function AddHomeworkController() {
    let getTemplate = templates.get('HomeworksTemplates/add-homework'),
        getData = requester.getJSON('https://elsyser.herokuapp.com/api/subjects/');

    Promise.all([getTemplate, getData])
        .then((result) => {
            let hbTemplate = Handlebars.compile(result[0]),
                template = hbTemplate(result[1]);

            $('#content').html(template);

            $('#sandbox-container input').datepicker({
                format: "yyyy-mm-dd",
                todayBtn: "linked",
                language: "bg",
                orientation: "bottom auto",
                calendarWeeks: true,
                autoclose: true,
                todayHighlight: true
            });

            formHandler();

            $('#add-homework').on('click', () => {
                postHomework();
            })

            $('#go-back').on('click', () => {
                HomeworksController();
            });
        })
}

function postHomework() {
    const homeworksUrl = 'https://elsyser.herokuapp.com/api/homeworks/';

    let body = {
        deadline: '',
        clazz: {
            number: null,
            letter: ''
        },
        details: ''
    }

    //TODO: Validate
    body.deadline = $('#date').val();
    body.clazz.number = $('#studentClassNumber').val();
    body.clazz.letter = $('#studentClassLetter').val();
    body.details = $('#details').val();

    requester.postJSON(homeworksUrl, body)
        .then(() => {
            toastr.success('Added homework successfully!');
            HomeworksController();
        }).catch((err) => {
            toastr.error('Couldn\'t add the homework!');
            console.log(err);
        })
}
