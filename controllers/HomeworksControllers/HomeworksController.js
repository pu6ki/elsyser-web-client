import { requester } from '../../utils/requster.js';
import { templates } from '../../utils/templates.js';
import { formHandler } from '../../utils/formHandler.js';

const homeworksUrl = 'https://elsyser.herokuapp.com/api/homeworks/';

export function HomeworksController() {
    let getData = requester.getJSON(homeworksUrl),
        getTemplate = templates.get('homeworks');

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

            let template = hbTemplate({ homeworks: data, isTeacher: isTeacher });
            $('#content').html(template);

            $('#add-homework').on('click', () => {
                addHomeworkController();
            })
        }).catch((err) => {
            console.log(err);
        });
}

function addHomeworkController() {
    templates.get('add-homework')
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
    let body = {
        deadline: '',
        subject: '',
        clazz: {
            number: null,
            letter: ''
        },
        details: ''
    }

    //TODO: Validate
    body.deadline = $('#date').val();
    body.subject = $('#subject').val();
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