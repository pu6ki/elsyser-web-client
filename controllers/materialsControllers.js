import { requester } from '../utils/requester.js';
import { templates } from '../utils/templates.js';
import { isTeacher, insertLineBreaks } from '../utils/helper.js';
import { validator } from '../utils/validator.js';
import { urls } from '../utils/urls.js';

function materialsController() {
    let getData = requester.getJSON(urls.materials);
    let getTemplate = templates.get('MaterialsTemplates/materials');

    Promise.all([getData, getTemplate])
        .then((result) => {
            let data = result[0],
                hbTemplate = Handlebars.compile(result[1]),
                token = window.localStorage.getItem('elsyser-token');

            data.forEach(function (el) {
                if (el.content.length > 150) {
                    el.content = el.content.slice(0, 149) + '...';
                }
            }, this);

            let template = hbTemplate({ materials: data, isTeacher: isTeacher(token) });
            $('#content').html(template);

            $('#add-material').on('click', () => {
                addMaterialController();
            })
        })
}

function addMaterialController() {
    let getTemplate = templates.get('MaterialsTemplates/add-material'),
        getData = requester.getJSON(urls.subjects);

    Promise.all([getTemplate, getData])
        .then((result) => {
            let hbTemplate = Handlebars.compile(result[0]),
                template = hbTemplate();

            $('#content').html(template);

            $('#add-material').on('click', () => {
                postMaterial(localStorage.getItem('elsyser-teachers-subject-id'));
            });

            $('#go-back').on('click', () => {
                materialsController();
            });
        });
}

function postMaterial(subjectId) {
    let body = {
        title: '',
        section: '',
        content: '',
        class_number: null,
        subject: {
            id: subjectId
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

    requester.postJSON(`${urls.materials}${subjectId}/`, body)
        .then(() => {
            toastr.success('Added material successfully!');
            materialsController();
        }).catch((err) => {
            toastr.error('Couldn\'t add the material!');
            console.log(err);
        })
}

function deleteMaterialController(subjectId, materialId) {
    let deleteMaterialUrl = `${urls.materials}/${subjectId}/${materialId}/`;

    requester.delete(deleteMaterialUrl)
        .then(() => {
            toastr.success('Deleted successfully!');
            materialsController();
        }).catch(() => {
            toastr.error('Can\'t delete the selected material!');
        });
}

function editMaterialController(subjectId, materialId) {
    let materialUrl = `${urls.materials}${subjectId}/${materialId}/`,
        getData = requester.getJSON(materialUrl),
        getSubjects = requester.getJSON(urls.subjects),
        getTemplate = templates.get('MaterialsTemplates/edit-material');

    Promise.all([getData, getSubjects, getTemplate])
        .then((result) => {
            let data = result[0],
                subjects = result[1],
                hbTemplate = Handlebars.compile(result[2]),
                template = hbTemplate({ data, subjects });

            $('#content').html(template);

            let options = $('#class-number').children();
            for (let option of options) {
                if (data.class_number.toString() === option.value) {
                    option.setAttribute('selected', 'selected');
                }
            }

            $('#save-button').on('click', () => {
                editData(subjectId, materialId);
            });

            $('#go-back').on('click', () => {
                detailedMaterialController(subjectId, materialId);
            });
        })
}

function editData(subjectId, materialId) {
    let materialUrl = `${urls.materials}${subjectId}/${materialId}/`,
        body = {
            title: '',
            section: '',
            content: '',
            class_number: null,
            subject: {
                id: subjectId
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

    requester.putJSON(materialUrl, body)
        .then(() => {
            toastr.success('Edited material successfully!');
            detailedMaterialController(subjectId, materialId);
        }).catch((err) => {
            toastr.error('Couldn\'t edit the material!');
            console.log(err);
        })
}

function detailedMaterialController(subjectId, materialId) {
    let materialUrl = `${urls.materials}${subjectId}/${materialId}/`,
        getData = requester.getJSON(materialUrl),
        getTemplate = templates.get('MaterialsTemplates/detailed-material'),
        currentUser = localStorage.getItem('elsyser-username');

    Promise.all([getData, getTemplate])
        .then((result) => {
            let data = result[0];

            if (currentUser === data.author.user.username) {
                data.editable = true;
            }

            data.content = insertLineBreaks(data.content);

            if (data.video_url === '') {
                data.video_url = null;
            }
            else {
                data.video_url = makeYouTubeVideoEmbedable(data.video_url);
            }

            let hbTemplate = Handlebars.compile(result[1]),
                template = hbTemplate(data);

            $('#content').html(template);

            $(`#material-${materialId}-edit`).on('click', () => {
                editMaterialController(subjectId, materialId);
            })

            $(`#material-${materialId}-delete`).on('click', () => {
                alertify.confirm("Are you sure you want to delete this material?", () => {
                    deleteMaterialController(subjectId, materialId);
                });
            });
        }).catch((err) => {
            notFoundController();
        })
}

function makeYouTubeVideoEmbedable(videoUrl) {
    let youtubeUrl = 'www.youtube.com/',
        index = videoUrl.indexOf(youtubeUrl) + youtubeUrl.length,
        result = videoUrl.slice(0, index) + 'embed/' + videoUrl.slice(index);

    return result.replace('watch?v=', '');
}

export let materials = {
    allMaterials: materialsController,
    detailedMaterial: detailedMaterialController
}