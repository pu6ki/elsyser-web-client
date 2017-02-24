import { requester } from '../../utils/requester.js';
import { templates } from '../../utils/templates.js';
import { validator } from '../../utils/validator.js';
import { formHandler } from '../../utils/formHandler.js';

import { EditNewsController } from './EditNewsController.js';
import { DeleteNewsController } from './DeleteNewsController.js';

import { AddCommentController } from './AddCommentController.js';
import { EditCommentController } from './EditCommentController.js';
import { DeleteCommentController } from './DeleteCommentController.js';

import { NotFoundController } from '../NotFoundController.js';


let dataFromAPI, currentUsername;
const newsUrl = "https://elsyser.herokuapp.com/api/news/";

export function DetailedNewsController(id) {
    currentUsername = localStorage.getItem('elsyser-username');
    let getData = requester.getJSON(newsUrl + id + '/'),
        getTemplate = templates.get('NewsTemplates/detailed-news');

    Promise.all([getData, getTemplate])
        .then((result) => {
            dataFromAPI = result[0];
            let hbTemplate = Handlebars.compile(result[1]),
                newsId = dataFromAPI.id;

            if (dataFromAPI.author.user.username === currentUsername) {
                dataFromAPI.editable = true;
            }

            dataFromAPI.comment_set.reverse();

            dataFromAPI.comment_set.forEach((el) => {
                if (el.posted_by.user.username === currentUsername) {
                    el.editableComment = true;
                }
            });

            let template = hbTemplate(dataFromAPI);
            $('#content').html(template);

            dataFromAPI.comment_set.forEach((el) => {
                let commentId = el.id;
                attachEditAndDeleteToComments(newsId, commentId);
            })

            $(`#news-${newsId}-edit`).on('click', () => {
                EditNewsController(newsId);
            })

            $(`#news-${newsId}-delete`).on('click', () => {
                alertify.confirm("Are you sure you want to delete this news?", () => {
                    DeleteNewsController(newsId);
                })
            })

            $('.new-comment').removeClass('new-comment');

            formHandler();

            $(".comment").slice(0, 2).show();
            $("#loadMore").on('click', () => {
                $(".comment:hidden").slice(0, 5).slideDown();
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
                AddCommentController(id);
                loadComments(id);
            });

        }).catch((err) => {
            NotFoundController();
            console.log(err);
        });
}

export function loadComments(newsId) {
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
            if (commentsToLoad[i].posted_by.user == currentUsername) {
                commentsToLoad[i].newsId = newsId;
                commentsToLoad[i].editable = true;
            }
            let template = hbTemplate(commentsToLoad[i]);
            $('#comments').prepend(template);
            attachEditAndDeleteToComments(newsId, commentsToLoad[i].id);
        }
    });
}

function attachEditAndDeleteToComments(newsId, commentId) {
    $(`#news-${newsId}-edit-comment-${commentId}`).on('click', () => {
        EditCommentController(newsId, commentId);
    })

    $(`#news-${newsId}-delete-comment-${commentId}`).on('click', () => {
        alertify.confirm("Are you sure you want to delete this comment?", () => {
            DeleteCommentController(newsId, commentId);
        })
    })
}