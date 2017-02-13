import { requester } from '../../utils/requester.js';
import { templates } from '../../utils/templates.js';
import { validator } from '../../utils/validator.js';

import { DetailedMaterialController } from './DetailedMaterialController.js';

export function EditMaterialController(subjectId, materialId) {
    let materialUrl = `https://elsyser.herokuapp.com/api/materials/${subjectId}/${materialId}/`,
        getData = requester.getJSON(materialUrl),
        getSubjects = requester.getJSON('https://elsyser.herokuapp.com/api/subjects/'),
        getTemplate = templates.get('MaterialsTemplates/edit-material');

    Promise.all([getData, getSubjects, getTemplate])
        .then((result) => {
            let data = result[0],
                subjects = result[1],
                hbTemplate = Handlebars.compile(result[2]),
                template = hbTemplate({data, subjects});

            $('#content').html(template);

            $('#save-button').on('click', () => {
                editData(subjectId, materialId);
            });

            $('#go-back').on('click', () => {
                DetailedMaterialController(subjectId, materialId);
            });
        })
}

function editData(subjectId, materialId) {
    let materialUrl = `https://elsyser.herokuapp.com/api/materials/${subjectId}/${materialId}/`,
        body = {
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
    body.subject.id = $('#subject-id').val();
    body.video_url = $('#video-url').val();

    requester.putJSON(materialUrl, body)
        .then(() => {
            toastr.success('Edited material successfully!');
            DetailedMaterialController(subjectId, materialId);
        }).catch((err) => {
            toastr.error('Couldn\'t edit the material!');
            console.log(err);
        })
}