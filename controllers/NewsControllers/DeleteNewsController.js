import { requester } from '../../utils/requester.js';
import { isTeacher } from '../../utils/helper.js';

export function DeleteNewsController(newsUrl, id) {
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