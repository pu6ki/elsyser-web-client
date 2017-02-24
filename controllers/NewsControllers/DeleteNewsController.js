import { requester } from '../../utils/requester.js';

import { DetailedNewsController } from './DeleteNewsController.js';

const newsUrl = 'https://elsyser.herokuapp.com/api/news/';

export function DeleteNewsController(id) {
    let deleteNewsUrl = newsUrl + id + '/';

    requester.delete(deleteNewsUrl)
        .then(() => {
            toastr.success('Deleted successfully!');
            DetailedNewsController(id);
        }).catch(() => {
            toastr.error('Can\'t delete the selected news!');
        });
}