import { requester } from '../utils/requester.js';
import { templates } from '../utils/templates.js';
import { isTeacher } from '../utils/helper.js';
import { validator } from '../utils/validator.js'
import { formHandler } from '../utils/formHandler.js';
import { urls } from '../utils/urls.js';

import { notFoundController } from './notFoundController.js';

function newsController(newsUrl) {
    let token = localStorage.getItem('elsyser-token');

    let getData = requester.getJSON(newsUrl),
        getTemplate = templates.get('NewsTemplates/news');

    Promise.all([getData, getTemplate])
        .then((result) => {
            let data = result[0],
                hbTemplate = Handlebars.compile(result[1]);

            data.forEach((el) => {
                if (el.comment_set.length > 0) {
                    el.comments_count = el.comment_set.length;
                }
                if (el.content.length > 150) {
                    el.content = el.content.slice(0, 149) + '...';
                }
                
                el.isTeacher = isTeacher(token);
            }, this);

            let intlData = {
                "locales": "en-US",
                "messages": {
                    "comments": `{comments_count, plural, 
                        =1 {One comment}
                        other {# comments}
                    }`
                }
            };

            data.isTeacher = isTeacher(token);

            let template = hbTemplate(data, {
                data: { intl: intlData }
            });
            $('#content').html(template);

            $('#add-news').on('click', () => {
                addNewsController(newsUrl);
            })
        }).catch((err) => {
            console.log(err);
            notFoundController();
        });
}

function addNewsController(newsUrl) {
    let token = localStorage.getItem('elsyser-token');
    if (isTeacher(token)) {
        templates.get('NewsTemplates/select-strategy')
            .then((result) => {
                let hbTemplate = Handlebars.compile(result);
                let template = hbTemplate();

                $('#content').html(template);

                $('#whole-class').on('click', () => {
                    selectWholeClass(newsUrl);
                });

                $('#concrete-class').on('click', () => {
                    concreteClass(newsUrl);
                });

                $('#go-back').on('click', () => {
                    newsController(newsUrl);
                })
            })

    } else {
        loadTemplate(newsUrl);
    }
}

function loadTemplate(newsUrl) {
    templates.get('NewsTemplates/add-news')
        .then((res) => {
            let hbTemplate = Handlebars.compile(res),
                template = hbTemplate();

            $('#content').html(template);

            $('#go-back').on('click', () => {
                newsController(newsUrl);
            })

            $('#add-news').on('click', () => {
                postNews(newsUrl);
            });
        });
}

function getNewsDataFromTemplate() {
    let body = {
        title: '',
        content: ''
    };

    if (validator.title($('#news-title').val())) {
        body.title = $('#news-title').val();
    }
    else {
        toastr.error('Title shoud be between 3 and 100 characters long!');
        return;
    }

    if (validator.content($('#news-content').val())) {
        body.content = $('#news-content').val();
    }
    else {
        toastr.error('Content shoud be between 5 and 10000 characters long!');
        return;
    }

    return body;
}

function postNews(newsUrl) {
    let data = getNewsDataFromTemplate();
    if (data) {
        requester.postJSON(newsUrl, data)
            .then((result) => {
                if (result) {
                    toastr.success('News added!');
                    newsController(newsUrl);
                }
            }).catch((err) => {
                console.log(err);
                toastr.error('Couldn\'t add the news Please check for errors!');
            });
    }
}

function selectWholeClass(newsUrl) {
    let getData = requester.getJSON(urls.classes);
    let getTemplate = templates.get('NewsTemplates/select-whole-class');
    let getPartial = templates.get('partials/whole-class');

    Promise.all([getData, getTemplate, getPartial])
        .then((result) => {
            let wholeClasses = result[0];
            let hbTemplate = Handlebars.compile(result[1]);
            let partial = Handlebars.compile(result[2]);

            $('#content').html(hbTemplate());

            for (let wholeClass in wholeClasses) {
                let data = {
                    number: wholeClass
                }

                $('#content').append(partial(data));

                $(`#${wholeClass}-class`).on('click', () => {
                    let newNewsUrl = `${newsUrl}${wholeClass}/`
                    console.log(newNewsUrl)
                    loadTemplate(newNewsUrl);
                })
            }
        })
}

function concreteClass(newsUrl) {
    let getData = requester.getJSON(urls.classes);
    let getTemplate = templates.get('NewsTemplates/select-concrete-class');

    Promise.all([getData, getTemplate])
        .then((result) => {
            let wholeClasses = result[0];
            let hbTemplate = Handlebars.compile(result[1]);

            $('#content').html('');
            for (let classNum in wholeClasses) {
                for (let schoolClass of wholeClasses[classNum]) {
                    $('#content').append(hbTemplate(schoolClass));

                    $(`#${schoolClass.number}${schoolClass.letter}`).on('click', () => {
                        let newNewsUrl = `${newsUrl}${schoolClass.number}/${schoolClass.letter}/`
                        loadTemplate(newNewsUrl);
                    });
                }
            }
        });
}

function editNewsController(newsUrl, id) {
    let selectedNewsUrl = `${newsUrl}${id}/`,
        getData = requester.getJSON(selectedNewsUrl),
        getTemplate = templates.get('NewsTemplates/edit-news');

    Promise.all([getData, getTemplate])
        .then((result) => {
            let data = result[0],
                hbTemplate = Handlebars.compile(result[1]),
                template = hbTemplate(data);

            $('#content').html(template);

            $('#save-button').on('click', () => {
                editNewsData(newsUrl, id);
            });

            $('#go-back').on('click', () => {
                detailedNewsController(newsUrl, id);
            });
        });
}

function editNewsData(newsUrl, id) {
    let body = {
        title: '',
        content: '',
        edited: true
    },
        selectedNewsUrl = `${newsUrl}${id}/`;

    if (validator.title($('#new-news-title').val())) {
        body.title = $('#new-news-title').val();
    }
    else {
        toastr.error('Title shoud be between 3 and 100 characters long!');
        return;
    }
    if (validator.content($('#new-news-content').val())) {
        body.content = $('#new-news-content').val();
    }
    else {
        toastr.error('Content shoud be between 5 and 10000 characters long!');
        return;
    }

    requester.putJSON(selectedNewsUrl, body)
        .then(() => {
            toastr.success("News updated successfully!");
            detailedNewsController(newsUrl, id);
        }).catch(() => {
            toastr.error('Couldn\'t update the selected news!');
        });

}

let dataFromAPI, currentUsername;

function detailedNewsController(newsUrl, id) {
    currentUsername = localStorage.getItem('elsyser-username');
    let getData = requester.getJSON(`${newsUrl}${id}/`),
        getTemplate = templates.get('NewsTemplates/detailed-news');

    Promise.all([getData, getTemplate])
        .then((result) => {
            dataFromAPI = result[0];
            let hbTemplate = Handlebars.compile(result[1]),
                newsId = dataFromAPI.id;

            dataFromAPI.editable = dataFromAPI.author.username === currentUsername;

            dataFromAPI.comment_set.forEach((el) => {
                el.editableComment = el.posted_by.username === currentUsername;
            });

            dataFromAPI.isTeacher = isTeacher(localStorage.getItem('elsyser-token'));

            let template = hbTemplate(dataFromAPI);
            $('#content').html(template);

            dataFromAPI.comment_set.forEach((el) => {
                let commentId = el.id;
                attachEditAndDeleteToComments(newsUrl, newsId, commentId);
            })

            $(`#news-${newsId}-edit`).on('click', () => {
                editNewsController(newsUrl, newsId);
            })

            $(`#news-${newsId}-delete`).on('click', () => {
                alertify.confirm("Are you sure you want to delete this news?", () => {
                    deleteNewsController(newsUrl, newsId);
                })
            })

            $('.new-comment').removeClass('new-comment');

            formHandler();

            $(".comment").slice(0, 3).show();
            $("#loadMore").on('click', () => {
                $(".comment:hidden").slice(0, 5).slideDown();
            });

            $('.toTop').click(function () {
                $('body,html').animate({
                    scrollTop: 0
                }, 600);
                return false;
            });

            $('#add-comment-button').on('click', () => {
                addCommentController(newsUrl, id);
                loadComments(newsUrl, id);
            });

        }).catch((err) => {
            console.log(err);
            notFoundController();
        });
}

export function loadComments(newsUrl, newsId) {
    let getData = requester.getJSON(`${newsUrl}${newsId}/`),
        getTemplate = templates.get('partials/comment');

    Promise.all([getData, getTemplate]).then((result) => {
        let newData = result[0],
            hbTemplate = Handlebars.compile(result[1]),
            commentsToLoad = [];

        commentsToLoad = newData.comment_set.filter(function (obj) {
            return !dataFromAPI.comment_set.some(function (obj2) {
                return obj.id === obj2.id;
            });
        });

        dataFromAPI.comment_set = newData.comment_set;

        for (let comment of commentsToLoad) {
            if (comment.posted_by.username === currentUsername) {
                comment.newsId = newsId;
                comment.editable = true;
            }
            let template = hbTemplate(comment);
            $('#comments').prepend(template);
            attachEditAndDeleteToComments(newsUrl, newsId, comment.id);
        }
    });
}

function attachEditAndDeleteToComments(newsUrl, newsId, commentId) {
    $(`#news-${newsId}-edit-comment-${commentId}`).on('click', () => {
        editCommentController(newsUrl, newsId, commentId);
    })

    $(`#news-${newsId}-delete-comment-${commentId}`).on('click', () => {
        alertify.confirm("Are you sure you want to delete this comment?", () => {
            deleteCommentController(newsUrl, newsId, commentId);
            detailedNewsController(newsUrl, newsId);
        })
    })
}

function editCommentController(newsUrl, newsId, commentId) {
    let commentToEditUrl = `${newsUrl}${newsId}/comments/${commentId}/`;
    let getData = requester.getJSON(commentToEditUrl);
    let getTemplate = templates.get('partials/edit-comment');

    Promise.all([getData, getTemplate])
        .then((result) => {
            let data = result[0],
                hbTemplate = Handlebars.compile(result[1]),
                template = hbTemplate(data);

            $(`#comment-${commentId}`).html(template);

            formHandler();

            $('#save-button').on('click', () => {
                editCommentData(newsUrl, newsId, commentToEditUrl);
            });
        });
}

function editCommentData(newsUrl, newsId, commentUrl) {
    let body = {
        content: '',
        edited: true
    };

    if (validator.comment($('#new-comment-content').val())) {
        body.content = $('#new-comment-content').val();
    }
    else {
        toastr.error('Couldn\'t edit the comment! It should have maximum length of 2048 characters!');
        return;
    }

    requester.putJSON(commentUrl, body)
        .then(() => {
            toastr.success('Comment updated successfully!');
            detailedNewsController(newsUrl, newsId);
        }).catch((err) => {
            console.log(err);
            toastr.error('Couldn\'t edit the comment!');
        });
}

function deleteNewsController(newsUrl, id) {
    let deleteNewsUrl = newsUrl + id + '/';

    requester.delete(deleteNewsUrl)
        .then(() => {
            let token = localStorage.getItem('elsyser-token');

            toastr.success('Deleted successfully!');
            if (isTeacher(token)) {
                window.location.href = '/#/news/teachers/';
            } else {
                window.location.href = '/#/news/students/'
            }
        }).catch(() => {
            toastr.error('Can\'t delete the selected news!');
        });
}

function deleteCommentController(newsUrl, newsId, commentId) {
    let commentToDeleteUrl = `${newsUrl}${newsId}/comments/${commentId}/`;

    requester.delete(commentToDeleteUrl)
        .then(() => {
            toastr.success('Comment deleted successfully!');
            $(`#comment-${commentId}`).html('');
        }).catch((err) => {
            toastr.error('Couldn\'t delete the selected comment!');
        });
}

function addCommentController(newsUrl, id) {
    let body = {
        content: ''
    },
        addCommentUrl = `${newsUrl}${id}/comments/`;

    if (validator.comment($('#comment-content').val())) {
        body.content = $('#comment-content').val();
        requester.postJSON(addCommentUrl, body)
            .then(() => {
                toastr.success('Comment added!');
                $('#comment-content').val('');
            }).catch((err) => {
                toastr.error('Comments can\'t be empty! Comments shold be max 2048 characters long!');
            });
    }
}

export let news = {
    allNews: newsController,
    detailedNews: detailedNewsController
}
