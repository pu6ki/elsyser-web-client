import { requester } from '../../utils/requester.js';
import { templates } from '../../utils/templates.js';
import { validator } from '../../utils/validator.js';
import { formHandler } from '../../utils/formHandler.js';
import { isTeacher } from '../../utils/helper.js';

import { EditNewsController } from './EditNewsController.js';
import { DeleteNewsController } from './DeleteNewsController.js';

import { AddCommentController } from './AddCommentController.js';
import { EditCommentController } from './EditCommentController.js';
import { DeleteCommentController } from './DeleteCommentController.js';

import { NotFoundController } from '../NotFoundController.js';

let dataFromAPI, currentUsername;

export function DetailedNewsController(newsUrl, id) {
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
                EditNewsController(newsUrl, newsId);
            })

            $(`#news-${newsId}-delete`).on('click', () => {
                alertify.confirm("Are you sure you want to delete this news?", () => {
                    DeleteNewsController(newsUrl, newsId);
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
                AddCommentController(newsUrl, id);
                loadComments(newsUrl, id);
            });

        }).catch((err) => {
            NotFoundController();
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
    console.log('newsId ' + newsId);
    console.log('newsUrl' + newsUrl);
    console.log('commentId ' + commentId);
    $(`#news-${newsId}-edit-comment-${commentId}`).on('click', () => {
        EditCommentController(newsUrl, newsId, commentId);
    })

    $(`#news-${newsId}-delete-comment-${commentId}`).on('click', () => {
        alertify.confirm("Are you sure you want to delete this comment?", () => {
            DeleteCommentController(newsUrl, newsId, commentId);
        })
    })
}