import { requester } from '../../utils/requester.js';

const examsUrl = 'https://elsyser.herokuapp.com/api/exams/';

export function DeleteExamController(id) {
    let deleteExamUrl = examsUrl + id + '/';

    requester.delete(deleteExamUrl)
        .then(() => {
            toastr.success('Deleted successfully!');
            window.location.href = "#/exams";
        }).catch(() => {
            toastr.error('Can\'t delete the selected homework!');
        });
}