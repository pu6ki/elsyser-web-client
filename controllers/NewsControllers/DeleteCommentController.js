import { requester } from '../../utils/requester.js';

export function DeleteCommentController(newsId, commentId) {
    let commentToDeleteUrl = `https://elsyser.herokuapp.com/api/news/${newsId}/comments/${commentId}/`;

    requester.delete(commentToDeleteUrl)
        .then(() => {
            toastr.success('Comment deleted successfully!');
            $(`#comment-${commentId}`).html('');
        }).catch((err) => {
            toastr.error('Couldn\'t delete the selected comment!');
        });
}   
