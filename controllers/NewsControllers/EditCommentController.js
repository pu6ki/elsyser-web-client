import { requester } from '../../utils/requester.js';
import { templates } from '../../utils/templates.js';
import { validator } from '../../utils/validator.js';
import { formHandler } from '../../utils/formHandler.js';
import { DetailedNewsController } from './DetailedNewsController.js';

let commentToEditUrl;

export function EditCommentController(newsUrl, newsId, commentId) {
    commentToEditUrl = `${newsUrl}${newsId}/comments/${commentId}/`;
    let getData = requester.getJSON(commentToEditUrl),
        getTemplate = templates.get('partials/edit-comment');

    Promise.all([getData, getTemplate])
        .then((result) => {
            let data = result[0],
                hbTemplate = Handlebars.compile(result[1]),
                template = hbTemplate(data);
            
            console.log(commentId);
            $(`#comment-${commentId}`).html(template);

            formHandler();

            $('#save-button').on('click', () => {
                editData(commentToEditUrl, newsId, commentId);
            });
        });
}

function editData(commentUrl, newsId, commentId) {
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

    Promise.resolve(requester.putJSON(commentToEditUrl, body))
        .then(() => {
            toastr.success('Comment updated successfully!');
            DetailedNewsController(newsUrl, newsId);
        }).catch(() => {
            toastr.error('Couldn\'t edit the comment!');
        });
}
