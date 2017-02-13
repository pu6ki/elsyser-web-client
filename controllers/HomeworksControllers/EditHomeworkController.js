import { requester } from '../../utils/requester.js';
import { templates } from '../../utils/templates.js';
import { validator } from '../../utils/validator.js';

import { HomeworksController } from './HomeworksController.js'
import { DetailedHomeworkController } from './DetailedHomeworkController.js';

const homeworksUrl = `https://elsyser.herokuapp.com/api/homeworks/`;

export function EditHomeworkController(id) {
    let selectedHomeworkUrl = homeworksUrl + id + '/',
        getData = requester.getJSON(selectedHomeworkUrl),
        getTemplate = templates.get('HomeworksTemplates/edit-homework');

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
                DetailedHomeworkController(id);
            })
        });
}

function editData(id) {
    let body = {
        deadline: '',
        details: ''
    },
        selectedHomeworkUrl = homeworksUrl + id + '/';

    if (validator.content($('#new-details-content').val())) {
        body.details = $('#new-details-content').val();
    }
    else {
        toastr.error('Details shoud be between 5 and 10000 characters long!');
        return;
    }
    body.deadline = $('#new-deadline-content').val();

    requester.putJSON(selectedHomeworkUrl, body)
        .then(() => {
            toastr.success('Homework edited successfully!');
            DetailedHomeworkController(id);
        }).catch(() => {
            toastr.error('Couldn\'t update the selected homework!');
        })
}