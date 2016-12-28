import { requester } from '../../utils/requster.js';
import { templates } from '../../utils/templates.js';
import { formHandler } from '../../utils/formHandler.js';
import { HomeworksController } from './HomeworksController.js';

export function AddHomeworkController() {
    templates.get('HomeworksTemplates/add-homework')
        .then((res) => {
            let hbTemplate = Handlebars.compile(res),
                template = hbTemplate();

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
        })
}

function postHomework() {
    const homeworksUrl = 'https://elsyser.herokuapp.com/api/homeworks/';

    let body = {
        deadline: '',
        subject: {
            title: ''   
        },
        clazz: {
            number: null,
            letter: ''
        },
        details: ''
    }

    //TODO: Validate
    body.deadline = $('#date').val();
    body.subject.title = $('#subject').val();
    body.clazz.number = $('#studentClassNumber').val();
    body.clazz.letter = $('#studentClassLetter').val();
    body.details = $('#details').val();

    requester.postJSON(homeworksUrl, body)
        .then(() => {
            toastr.success('Added homework successfully!');
            HomeworksController();
        }).catch((err) => {
            toastr.error('Couldn\'t add the homework');
            console.log(err);
        })
}