import { requester } from '../../utils/requester.js';
import { templates } from '../../utils/templates.js';
import { validator } from '../../utils/validator.js';

export function AddCommentController(id) {
    let body = {
            content: ''
        },
        addCommentUrl = `https://elsyser.herokuapp.com/api/news/${id}/comments/`;

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
