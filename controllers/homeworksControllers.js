import { requester } from '../utils/requester.js';
import { templates } from '../utils/templates.js';
import { formHandler } from '../utils/formHandler.js';
import { isTeacher, insertLineBreaks } from '../utils/helper.js';
import { validator } from '../utils/validator.js';
import { urls } from '../utils/urls.js';

import { notFoundController } from './notFoundController.js';

function homeworksController() {
    let getData = requester.getJSON(urls.homeworks),
        getTemplate = templates.get('HomeworksTemplates/homeworks');

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

            let template = hbTemplate({ homeworks: data, isTeacher: isTeacher(token) });
            $('#content').html(template);

            $('#add-homework').on('click', () => {
                addHomeworkController();
            })
        }).catch((err) => {
            console.log(err);
        });
}

function addHomeworkController() {
    let getTemplate = templates.get('HomeworksTemplates/add-homework'),
        getData = requester.getJSON(urls.subjects);

    Promise.all([getTemplate, getData])
        .then((result) => {
            let hbTemplate = Handlebars.compile(result[0]),
                template = hbTemplate(result[1]);

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

            $('#go-back').on('click', () => {
                homeworksController();
            });
        })
}

function postHomework() {
    let body = {
        deadline: '',
        clazz: {
            number: null,
            letter: ''
        },
        details: ''
    }

    //TODO: Validate
    body.deadline = $('#date').val();
    body.clazz.number = $('#studentClassNumber').val();
    body.clazz.letter = $('#studentClassLetter').val();
    body.details = $('#details').val();

    requester.postJSON(urls.homeworks, body)
        .then(() => {
            toastr.success('Added homework successfully!');
            homeworksController();
        }).catch((err) => {
            toastr.error('Couldn\'t add the homework!');
            console.log(err);
        })
}

function deleteHomeworkController(id) {
    let deleteHomeworkUrl = `${urls.homeworks}${id}/`;

    requester.delete(deleteHomeworkUrl)
        .then(() => {
            toastr.success('Deleted successfully!');
            window.location.href = "/#/homeworks";
        }).catch(() => {
            toastr.error('Can\'t delete the selected homework!');
        });
}

function detailedHomeworkController(id) {
    let homeworkUrl = `${urls.homeworks}${id}/`,
        getData = requester.getJSON(homeworkUrl),
        getTemplate = templates.get('HomeworksTemplates/detailed-homework'),
        currentUser = localStorage.getItem('elsyser-username');

    Promise.all([getData, getTemplate])
        .then((result) => {
            let data = result[0];

            if (currentUser === data.author.user.username) {
                data.editable = true;
            }

            let hbTemplate = Handlebars.compile(result[1]),
                template = hbTemplate(data);

            $('#content').html(template);

            $(`#homework-${id}-edit`).on('click', () => {
                editHomeworkController(id);
            })

            $(`#homework-${id}-delete`).on('click', () => {
                alertify.confirm("Are you sure you want to delete this homework?", () => {
                    deleteHomeworkController(id);
                })
            });

            viewSentHomework(id);

            $('#submissions-button').on('click', () => {
                submissionsController(id);
            });
        }).catch((err) => {
            console.log(err);
            notFoundController();
        });
}

function viewSentHomework(id) {
    let submissionsUrl = `${urls.homeworks}${id}/submissions/`,
        getData = requester.getJSON(submissionsUrl),
        getTemplate = templates.get('HomeworksTemplates/detailed-submission');

    Promise.all([getData, getTemplate])
        .then((result) => {
            let data = result[0][0],
                hbTemplate = Handlebars.compile(result[1]);

            if (data) {
                if (data.student.user.username === window.localStorage.getItem('elsyser-username')) {
                    data.editable = true;
                }
                data.content = insertLineBreaks(data.content);

                let template = hbTemplate(data);
                $('#sent-homework').html(template);

                $('#submission-edit').on('click', () => {
                    editSubmissionController(id, data.id);
                });
            }
            else {
                let template = hbTemplate(data);
                $('#sent-homework').html(template);

                $('#send-homework-button').on('click', () => {
                    sendHomeworkController(id);
                })
            }
        });
}

function detailedSubmissionController(homeworkId, submissionId) {
    let url = `${urls.homeworks}${homeworkId}/submissions/${submissionId}/`,
        getData = requester.getJSON(url),
        getTemplate = templates.get('HomeworksTemplates/detailed-submission');

    Promise.all([getData, getTemplate])
        .then((result) => {
            let data = result[0],
                hbTemplate = Handlebars.compile(result[1]);
            
            if(data.student.user.username === window.localStorage.getItem('elsyser-username')) {
                data.editable = true;
            }
            data.content = insertLineBreaks(data.content);
            let template = hbTemplate(data);

            $('#content').html(template);

            $('#mark-checked').on('click', () => {
                let body = {
                    content: '',
                    solution_url: '',
                    checked: true
                }

                if (validator.content($('#submission-content').text())) {
                    body.content = $('#submission-content').text();
                }
                else {
                    toastr.error('Content must contain atleast 5 characters.');
                }

                body.solution_url = $('#solution-url').text();

                requester.putJSON(url, body)
                    .then(() => {
                        toastr.success('Homework marked as checked successfully!');
                        detailedHomeworkController(homeworkId);
                    })
                    .catch((err) => {
                        console.log(err);
                        toastr.error('Couldn\'t marked as checked.');
                    })
            })
        })
}

function editHomeworkController(id) {
    let selectedHomeworkUrl = `${urls.homeworks}${id}/`,
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
                editHomeworkData(id);
            });

            $('#go-back').on('click', () => {
                detailedHomeworkController(id);
            })
        });
}

function editHomeworkData(id) {
    let body = {
        deadline: '',
        details: ''
    },
        selectedHomeworkUrl = `${urls.homeworks}${id}/`;

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
            detailedHomeworkController(id);
        }).catch(() => {
            toastr.error('Couldn\'t update the selected homework!');
        })
}

function editSubmissionController(homeworkId, submissionid) {
    let url = `${urls.homeworks}${homeworkId}/submissions/${submissionid}/`,
        getData = requester.getJSON(url),
        getTemplate = templates.get('HomeworksTemplates/edit-submission');

    Promise.all([getData, getTemplate])
        .then((result) => {
            let data = result[0],
                hbTemplate = Handlebars.compile(result[1]),
                template = hbTemplate(data);

            $('#content').html(template);

            $('#edit-button').on('click', () => {
                let body = {
                    content: '',
                    solution_url: ''
                }

                if (validator.content($('#submission-content').val())) {
                    body.content = $('#submission-content').val();
                }
                else {
                    toastr.error('Content must contain atleast 5 characters.');
                }

                body.solution_url = $('#solution-url').val();

                requester.putJSON(url, body)
                    .then(() => {
                        toastr.success('Homework edited successfully!');
                        detailedHomeworkController(homeworkId);
                    })
                    .catch((err) => {
                        console.log(err);
                        toastr.error('Couldn\'t edit homework.');
                    })
            });

            $('#go-back').on('click', () => {
                detailedHomeworkController(homeworkId);
            });
        });
}

function sendHomeworkController(homeworkId) {
    let url = `${urls.homeworks}${homeworkId}/submissions/`;

    templates.get('HomeworksTemplates/send-homework')
        .then((result) => {
            let hbTemplate = Handlebars.compile(result),
                template = hbTemplate();

            $('#content').html(template);

            $('#send-button').on('click', (homeworkId) => {
                let body = {
                    content: '',
                    solution_url: ''
                }

                if(validator.content($('#submission-content').val())) {
                    body.content = $('#submission-content').val();
                }
                else {
                    toastr.error('Content must contain atleast 5 characters.');
                    return;
                }

                body.solution_url = $('#solution-url').val();

                requester.postJSON(url, body)
                    .then(() => {
                        toastr.success('Homework sent successfully!');
                        homeworksController();
                    })
                    .catch((err) => {
                        console.log(err);
                        toastr.error('Couldn\'t send homework.');
                    })
            });

            $('#go-back').on('click', () => {
                detailedHomeworkController(homeworkId);
            })
        });
}

function submissionsController(homeworkId) {
    let submissionsUrl = `${urls.homeworks}${homeworkId}/submissions/`,
        getData = requester.getJSON(submissionsUrl),
        getTemplate = templates.get('HomeworksTemplates/submissions');

    Promise.all([getData, getTemplate])
        .then((result) => {
            let data = result[0],
                hbTemplate = Handlebars.compile(result[1]);

            data.forEach((el) => {
                if (el.content.length > 150) {
                    el.content = el.content.slice(0, 149) + '...';
                }

                el.homeworkId = homeworkId;
            })

            let template = hbTemplate(data);

            $('#content').html(template);
        })
        .catch((err) => {
            console.log(err);
            notFoundController();
        })
}

export let homeworks = {
    allHomeworks: homeworksController,
    detailedHomework: detailedHomeworkController,
    allSubmissions: submissionsController,
    detailedSubmission: detailedSubmissionController
}