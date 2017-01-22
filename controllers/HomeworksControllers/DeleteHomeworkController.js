import { requester } from '../../utils/requester.js';

const homeworksUrl = 'https://elsyser.herokuapp.com/api/homeworks/';

export function DeleteHomeworkController(id) {
    let deleteHomeworkUrl = homeworksUrl + id + '/';

    requester.delete(deleteHomeworkUrl)
        .then(() => {
            toastr.success('Deleted successfully!');
            window.location.href = "#/homeworks";
        }).catch(() => {
            toastr.error('Can\'t delete the selected homework!');
        });
}