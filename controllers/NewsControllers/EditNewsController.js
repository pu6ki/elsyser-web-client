import { requester } from '../../utils/requster.js';
import { templates } from '../../utils/templates.js';
import { validator } from '../../utils/validator.js';

const newsUrl = `https://elsyser.herokuapp.com/api/news/`;

export function EditNewsController(id) {
    let selectedNewsUrl = newsUrl + id + '/',
        getData = requester.getJSON(selectedNewsUrl),
        getTemplate = templates.get('edit-news');

    Promise.all([getData, getTemplate])
        .then((result) => {
            let data = result[0],
                hbTemplate = Handlebars.compile(result[1]),
                template = hbTemplate(data);

            $('#content').html(template);

            $('#save-button').on('click', () => {
                editData(id);
            })
        });
}

function editData(id) {
    let body = {
        title: '',
        content: '',
        edited: true
    },
        selectedNewsUrl = newsUrl + id + '/';

    if (validator.title($('#new-news-title').val())) {
        body.title = $('#new-news-title').val();
    }
    else {
        toastr.error('Title shoud be between 3 and 100 characters long!');
        return;
    }
    if (validator.content($('#new-news-content').val())) {
        body.content = $('#new-news-content').val();
    }
    else {
        toastr.error('Content shoud be between 5 and 10000 characters long!');
        return;
    }

    requester.putJSON(selectedNewsUrl, body)
        .then(() => {
            toastr.success("News updated successfully!");
            window.location.href = '#/news';
        }).catch(() => {
            toastr.error('Couldn\'t update the selected news!');
        });

}
