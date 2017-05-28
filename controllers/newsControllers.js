import { requester } from '../utils/requester.js';
import { templates } from '../utils/templates.js';
import { isTeacher } from '../utils/helper.js';
import { validator } from '../utils/validator.js'
import { formHandler } from '../utils/formHandler.js';

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
                    //TODO
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

function getDataFromTemplate() {
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
    let data = getDataFromTemplate();
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
    const classesUrl = 'https:/elsyser.herokuapp.com/api/classes/';
    let getData = requester.getJSON(classesUrl);
    let getTemplate = templates.get('NewsTemplates/select-whole-class');

    Promise.all([getData, getTemplate])
        .then((result) => {
            let wholeClasses = result[0];
            let hbTemplate = Handlebars.compile(result[1]);

            $('#content').html('');

            for (let wholeClass in wholeClasses) {
                let data = {
                    number: wholeClass
                }

                $('#content').append(hbTemplate(data));

                $(`#${wholeClass}-class`).on('click', () => {
                    let newNewsUrl = `${newsUrl}${wholeClass}/`
                    loadTemplate(newNewsUrl);
                })
            }

            $('#go-back').on('click', () => {
                newsController(newsUrl);
            });
        })
}

function concreteClass(newsUrl) {
    //TODO
}

function editNewsController(newsUrl, id) {
    let selectedNewsUrl = newsUrl + id + '/',
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
        selectedNewsUrl = newsUrl + id + '/';

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
    let getData = requester.getJSON(newsUrl + id + '/'),
        getTemplate = templates.get('NewsTemplates/detailed-news');

    Promise.all([getData, getTemplate])
        .then((result) => {
            dataFromAPI = result[0];
            let hbTemplate = Handlebars.compile(result[1]),
                newsId = dataFromAPI.id;

            if (dataFromAPI.author.username === currentUsername) {
                dataFromAPI.editable = true;
            }

            dataFromAPI.comment_set.reverse();

            dataFromAPI.comment_set.forEach((el) => {
                if (el.posted_by.username === currentUsername) {
                    el.editableComment = true;
                }
            });

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

            $(".comment").slice(0, 2).show();
            $("#loadMore").on('click', () => {
                $(".comment:hidden").slice(0, 3).slideDown();
                /*if ($("div:hidden").length === 0) {
                    $("#loadMore").fadeOut('slow');
                }*/
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
            notFoundController();
            console.log(err);
        });
}

export function loadComments(newsUrl, newsId) {
    let getData = requester.getJSON(newsUrl + newsId + '/'),
        getTemplate = templates.get('partials/comment');

    Promise.all([getData, getTemplate]).then((result) => {
        let newData = result[0],
            hbTemplate = Handlebars.compile(result[1]),
            commentsToLoad = [];

        newData.comment_set.reverse();

        commentsToLoad = newData.comment_set.filter(function (obj) {
            return !dataFromAPI.comment_set.some(function (obj2) {
                return obj.id === obj2.id;
            });
        });

        dataFromAPI.comment_set = newData.comment_set;

        for (let i = 0; i < commentsToLoad.length; i += 1) {    
            if (commentsToLoad[i].posted_by.username == currentUsername) {
                commentsToLoad[i].newsId = newsId;
                commentsToLoad[i].editable = true;
            }
            let template = hbTemplate(commentsToLoad[i]);
            $('#comments').prepend(template);
            attachEditAndDeleteToComments(newsUrl, newsId, commentsToLoad[i].id);
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
    let getData = requester.getJSON(commentToEditUrl),
        getTemplate = templates.get('partials/edit-comment');

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