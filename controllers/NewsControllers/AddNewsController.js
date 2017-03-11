import { requester } from '../../utils/requester.js';
import { templates } from '../../utils/templates.js';
import { validator } from '../../utils/validator.js';
import { isTeacher } from '../../utils/helper.js';

import { NewsController } from './NewsController.js';

export function AddNewsController(newsUrl) {
    let token = localStorage.getItem('elsyser-token');
    if (isTeacher(token)) {
        templates.get('NewsTemplates/select-strategy')
            .then((result) => {
                let hbTemplate = Handlebars.compile(result);
                let template = hbTemplate();

                $('#content').html(template);

                $('#whole-class').on('click', () => {
                    selectWholeClass(newsUrl);
                });

                $('#concrete-class').on('click', () => {
                    console.log('concrete class');
                });

                $('#go-back').on('click', () => {
                    NewsController(newsUrl);
                })
            })

    } else {
        loadTemplate(newsUrl);
    }
}

function loadTemplate(newsUrl) {
    templates.get('NewsTemplates/add-news')
        .then((res) => {
            let hbTemplate = Handlebars.compile(res),
                template = hbTemplate();

            $('#content').html(template);

            $('#go-back').on('click', () => {
                NewsController(newsUrl);
            })

            $('#add-news').on('click', () => {
                postNews(newsUrl);
            });
        });
}

function getDataFromTemplate() {
    let body = {
        title: '',
        content: ''
    };

    if (validator.title($('#news-title').val())) {
        body.title = $('#news-title').val();
    }
    else {
        toastr.error('Title shoud be between 3 and 100 characters long!');
        return;
    }

    if (validator.content($('#news-content').val())) {
        body.content = $('#news-content').val();
    }
    else {
        toastr.error('Content shoud be between 5 and 10000 characters long!');
        return;
    }

    return body;
}

function postNews(newsUrl) {
    let data = getDataFromTemplate();
    if (data) {
        requester.postJSON(newsUrl, data)
            .then((result) => {
                if (result) {
                    toastr.success('News added!');
                    NewsController(newsUrl);
                }
            }).catch(() => {
                toastr.error('Couldn\'t add the news Please check for errors!');
            });
    }
}

function selectWholeClass(newsUrl) {
    const classesUrl = 'https:/elsyser.herokuapp.com/api/classes/';
    let getData = requester.getJSON(classesUrl);
    let getTemplate = templates.get('NewsTemplates/select-whole-class');

    Promise.all([getData, getTemplate])
        .then((result) => {
            let wholeClasses = result[0];
            let hbTemplate = Handlebars.compile(result[1]);

            $('#content').html('');

            for (let wholeClass in wholeClasses) {
                let data = {
                    number: wholeClass
                }

                $('#content').append(hbTemplate(data));

                $(`#${wholeClass}-class`).on('click', () => {
                    let newNewsUrl = `${newsUrl}${wholeClass}/`
                    loadTemplate(newNewsUrl);
                })
            }

            $('#go-back').on('click', () => {
                NewsController(newsUrl);
            });
        })
}