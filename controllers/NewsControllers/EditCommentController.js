import { requester } from '../../utils/requester.js';
import { templates } from '../../utils/templates.js';
import { validator } from '../../utils/validator.js';
import { formHandler } from '../../utils/formHandler.js';
import { DetailedNewsController } from './DetailedNewsController.js';

export function EditCommentController(newsUrl, newsId, commentId) {
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
                editData(newsUrl, newsId, commentToEditUrl);
            });
        });
}

function editData(newsUrl, newsId, commentUrl) {
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
            DetailedNewsController(newsUrl, newsId);
        }).catch((err) => {
            console.log(err);
            toastr.error('Couldn\'t edit the comment!');
        });
}
