import { requester } from '../../utils/requester.js';
import { templates } from '../../utils/templates.js';

import { AddNewsController } from './AddNewsController.js';
import { NotFoundController } from '../NotFoundController.js';

const newsUrl = 'https://elsyser.herokuapp.com/api/news/';

export function NewsController() {
    let getData = requester.getJSON(newsUrl),
        getTemplate = templates.get('NewsTemplates/news');

    Promise.all([getData, getTemplate])
        .then((result) => {
            let data = result[0],
                hbTemplate = Handlebars.compile(result[1]);

            data.forEach((el) => {
                if (el.comment_set.length > 0) {
                    el.comments_count = el.comment_set.length;
                }
                if (el.content.length > 150) {
                    el.content = el.content.slice(0, 149) + '...';
                }
            }, this);

            let intlData = {
                "locales": "en-US",
                "messages": {
                    "comments": `{comments_count, plural, 
                        =1 {One comment}
                        other {# comments}
                    }`
                }
            };

            let template = hbTemplate(data, {
                data: { intl: intlData }
            });
            $('#content').html(template);

            $('#add-news').on('click', () => {
                AddNewsController();
            })
        }).catch((err) => {
            console.log(err);
            NotFoundController();
        });
}
