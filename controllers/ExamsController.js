import { requester } from '../utils/requster.js';
import { templates } from '../utils/templates.js';
import { formHandler } from '../utils/formHandler.js';

const examsUrl = 'https://elsyser.herokuapp.com/api/exams/';

export function ExamsController() {
    let getData = requester.getJSON(examsUrl),
        getTemplate = templates.get('exams');

    Promise.all([getData, getTemplate])
        .then((result) => {
            let data = result[0],
                hbTemplate = Handlebars.compile(result[1]),
                isTeacher = false,
                token = window.localStorage.getItem('token');

            data.forEach((el) => {
                if (el.details.length > 150) {
                    el.details = el.details.slice(0, 149) + '...';
                }
            });

            if (token.length === 41 && token[40] === '1') {
                isTeacher = true;
            }

            let template = hbTemplate({ exams: data, isTeacher: isTeacher });
            $('#content').html(template);

            $('#add-exam').on('click', () => {
                addExamController();
            })
        }).catch((err) => {
            console.log(err);
        });
}

function addExamController() {
    templates.get('add-exam')
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

            $('#add-exam').on('click', () => {
                postExam();
            })
        })
}

function postExam() {
    let body = {
        date: '',
        subject: '',
        topic: '',
        clazz: ''
    }

    //TODO: Validate
    body.date = $('#date').val();
    body.subject = $('#subject').val();
    body.topic = $('#topic').val();
    body.clazz = $('#studentClassNumber').val() + $('#studentClassLetter').val();

    requester.postJSON(examsUrl, body)
        .then(() => {
            toastr.success('Added exam successfully!');
            ExamsController();
        }).catch((err) => {
            toastr.error('Couldn\'t add the exam');
            console.log(err);
        })
}