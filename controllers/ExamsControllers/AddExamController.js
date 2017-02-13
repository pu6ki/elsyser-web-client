import { requester } from '../../utils/requester.js';
import { templates } from '../../utils/templates.js';
import { formHandler } from '../../utils/formHandler.js';

import { ExamsController } from './ExamsController.js';

export function AddExamController() {
    let getTemplate = templates.get('ExamsTemplates/add-exam'),
        getData = requester.getJSON('https://elsyser.herokuapp.com/api/subjects/');

    Promise.all([getTemplate, getData])
        .then((result) => {
            let hbTemplate = Handlebars.compile(result[0]),
                template = hbTemplate(result[1]);

            $('#content').html(template);

            $('#sandbox-container input').datepicker({
                daysOfWeekDisabled: "0,6",
                format: "yyyy-mm-dd",
                todayBtn: "linked",
                language: "bg",
                orientation: "bottom auto",
                calendarWeeks: true,
                autoclose: true,
                todayHighlight: true
            });

            formHandler();

            $('#add-exam').on('click', () => {
                postExam();
            })
            
            $('#go-back').on('click', () => {
                ExamsController();
            });
        })
}

function postExam() {
    const examsUrl = 'https://elsyser.herokuapp.com/api/exams/';

    let body = {
        date: '',
        topic: '',
        clazz: {
            number: null,
            letter: ''
        },
        details: ''
    }

    //TODO: Validate
    body.date = $('#date').val();
    body.topic = $('#topic').val();
    body.clazz.number = $('#studentClassNumber').val();
    body.clazz.letter = $('#studentClassLetter').val();
    body.details = $('#details').val();

    requester.postJSON(examsUrl, body)
        .then(() => {
            toastr.success('Added exam successfully!');
            ExamsController();
        }).catch((err) => {
            toastr.error('Couldn\'t add the exam');
            console.log(err);
        })
}
