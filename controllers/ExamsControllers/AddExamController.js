import { requester } from '../../utils/requster.js';
import { templates } from '../../utils/templates.js';
import { formHandler } from '../../utils/formHandler.js';
import { ExamsController } from './ExamsController.js';

export function AddExamController() {
    templates.get('ExamsTemplates/add-exam')
        .then((res) => {
            let hbTemplate = Handlebars.compile(res),
                template = hbTemplate();

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
        })
}

function postExam() {
    const examsUrl = 'https://elsyser.herokuapp.com/api/exams/';

    let body = {
        date: '',
        subject: {
            title: ''   
        },
        topic: '',
        clazz: {
            number: null,
            letter: ''
        },
        details: ''
    }

    //TODO: Validate
    body.date = $('#date').val();
    body.subject.title = $('#subject').val();
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