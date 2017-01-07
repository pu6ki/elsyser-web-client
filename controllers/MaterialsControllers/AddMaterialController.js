import { requester } from '../../utils/requster.js';
import { templates } from '../../utils/templates.js';
import { formHandler } from '../../utils/formHandler.js';
import { validator } from '../../utils/validator.js';

import { MaterialsController } from './MaterialsController.js';

export function AddMaterialController() {
    let getTemplate = templates.get('MaterialsTemplates/add-material'),
        getData = requester.getJSON('https://elsyser.herokuapp.com/api/subjects/');

    Promise.all([getTemplate, getData])
        .then((result) => {
            let hbTemplate = Handlebars.compile(result[0]),
                template = hbTemplate();

            $('#content').html(template);

            $('#add-material').on('click', () => {
                postMaterial(result[1][0].id);
            })
        })
}

function postMaterial(subjectId) {
    const materialsUrl = 'https://elsyser.herokuapp.com/api/materials/';

    let body = {
        title: '',
        section: '',
        content: '',
        class_number: null,
        subject: {
            id: null
        },
        video_url: ''
    }

    if (validator.title($('#title').val())) {
        body.title = $('#title').val();
    }
    else {
        toastr.error('Title should be between 3 and 150 characters long.')
        return;
    }

    if (validator.title($('#section').val())) {
        body.section = $('#section').val();
    }
    else {
        toastr.error('Section should be between 3 and 150 characters long.')
        return;
    }

    if (validator.content($('#material-content').val())) {
        body.content = $('#material-content').val();
    }
    else {
        toastr.error('Content can\'t be empty.');
        return;
    }

    if (validator.classNumber($('#class-number').val())) {
        body.class_number = $('#class-number').val();
    }
    else {
        toastr.error('Invalid class number.');
        return;
    }

    body.video_url = $('#video-url').val();

    requester.postJSON(materialsUrl + subjectId + '/', body)
        .then(() => {
            toastr.success('Added material successfully!');
            MaterialsController();
        }).catch((err) => {
            toastr.error('Couldn\'t add the material!');
            console.log(err);
        })
}
