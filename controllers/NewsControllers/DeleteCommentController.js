import { requester } from '../../utils/requester.js';

export function DeleteCommentController(newsUrl, newsId, commentId) {
    let commentToDeleteUrl = `${newsUrl}${newsId}/comments/${commentId}/`;

    requester.delete(commentToDeleteUrl)
        .then(() => {
            toastr.success('Comment deleted successfully!');
            $(`#comment-${commentId}`).html('');
        }).catch((err) => {
            toastr.error('Couldn\'t delete the selected comment!');
        });
}   
