import { requester } from '../../utils/requester.js';
import { templates } from '../../utils/templates.js';
import { validator } from '../../utils/validator.js';

import { ExamsController } from './ExamsController.js';
import { DetailedExamsController } from './DetailedExamsController.js';

const examsUrl = `https://elsyser.herokuapp.com/api/exams/`;

export function EditExamController(id) {
    let selectedExamUrl = examsUrl + id + '/',
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
                DetailedExamsController(id);
            });
        });
}

function editData(id) {
    let body = {
        topic: '',
        date: '',
        details: ''
    },
        selectedExamUrl = examsUrl + id + '/';

    if (validator.title($('#new-exam-topic').val())) {
        body.topic = $('#new-exam-topic').val();
    }
    else {
        toastr.error('Topic shoud be between 3 and 100 characters long!');
        return;
    }
    
    body.details = $('#new-details-content').val();
    body.date = $('#new-date-content').val();

    requester.putJSON(selectedExamUrl, body)
        .then(() => {
            toastr.success('Exam edited successfully!');
            ExamsController();
        }).catch(() => {
            toastr.error('Couldn\'t update the selected exam!');
        })
}
