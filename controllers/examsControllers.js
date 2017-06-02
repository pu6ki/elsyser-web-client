import { requester } from '../utils/requester.js';
import { templates } from '../utils/templates.js';
import { isTeacher } from '../utils/helper.js';
import { formHandler } from '../utils/formHandler.js';
import { validator } from '../utils/validator.js';
import { urls } from '../utils/urls.js';

import { notFoundController } from './notFoundController.js'

export function examsController() {
    let getData = requester.getJSON(urls.exams),
        getTemplate = templates.get('ExamsTemplates/exams');

    Promise.all([getData, getTemplate])
        .then((result) => {
            let data = result[0],
                hbTemplate = Handlebars.compile(result[1]),
                token = window.localStorage.getItem('elsyser-token');

            data.forEach((el) => {
                if (el.details.length > 150) {
                    el.details = el.details.slice(0, 149) + '...';
                }
            });

            let template = hbTemplate({ exams: data, isTeacher: isTeacher(token) });
            $('#content').html(template);

            $('#add-exam').on('click', () => {
                addExamController();
            })
        }).catch((err) => {
            console.log(err);
        });
}

function addExamController() {
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
                examsController();
            });
        })
}

function postExam() {
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

    requester.postJSON(urls.exams, body)
        .then(() => {
            toastr.success('Added exam successfully!');
            еxamsController();
        }).catch((err) => {
            toastr.error('Couldn\'t add the exam');
            console.log(err);
        })
}


function deleteExamController(id) {
    let deleteExamUrl = urls.exams + id + '/';

    requester.delete(deleteExamUrl)
        .then(() => {
            toastr.success('Deleted successfully!');
            window.location.href = "#/exams";
        }).catch(() => {
            toastr.error('Can\'t delete the selected homework!');
        });
}

function detailedExamsController(id) {
    let examUrl = `https://elsyser.herokuapp.com/api/exams/${id}/`,
        getData = requester.getJSON(examUrl),
        getTemplate = templates.get('ExamsTemplates/detailed-exam');

    Promise.all([getData, getTemplate])
        .then((result) => {
            let data = result[0],
                currentUser = window.localStorage.getItem('elsyser-username');

            if (currentUser === data.author.user.username) {
                data.editable = true;
            }

            let hbTemplate = Handlebars.compile(result[1]),
                template = hbTemplate(data);

            $('#content').html(template);

            $(`#exam-${id}-edit`).on('click', () => {
                editExamController(id);
            })

            $(`#exam-${id}-delete`).on('click', () => {
                alertify.confirm("Are you sure you want to delete this exam?", () => {
                    deleteExamController(id);
                })
            })
        }).catch((err) => {
            notFoundController();
        })
}

function editExamController(id) {
    let selectedExamUrl = urls.exams + id + '/',
        getData = requester.getJSON(selectedExamUrl),
        getTemplate = templates.get('ExamsTemplates/edit-exam');

    Promise.all([getData, getTemplate])
        .then((result) => {
            let data = result[0],
                hbTemplate = Handlebars.compile(result[1]),
                template = hbTemplate(data);

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

            $('#save-button').on('click', () => {
                editData(id);
            });

            $('#go-back').on('click', () => {
                detailedExamsController(id);
            });
        });
}

function editData(id) {
    let body = {
        topic: '',
        date: '',
        details: ''
    },
        selectedExamUrl = urls.exams + id + '/';

    if (validator.title($('#new-exam-topic').val())) {
        body.topic = $('#new-exam-topic').val();
    }
    else {
        toastr.error('Topic shoud be between 3 and 100 characters long!');
        return;
    }
    
    body.details = $('#new-details-content').val();
    body.date = $('#date').val();

    requester.putJSON(selectedExamUrl, body)
        .then(() => {
            toastr.success('Exam edited successfully!');
            examsController();
        }).catch(() => {
            toastr.error('Couldn\'t update the selected exam!');
        })
}


export let exams = {
  allExams: examsController,
  detailedExam: detailedExamsController
}