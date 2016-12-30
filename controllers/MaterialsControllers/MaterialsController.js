import { requester } from '../../utils/requster.js';
import { templates } from '../../utils/templates.js';
import { isTeacher } from '../../utils/helper.js'
import { AddMaterialController } from './AddMaterialController.js';

export function MaterialsController() {
    const materialsUrl = 'https://elsyser.herokuapp.com/api/materials/'

    let getTemplate = templates.get('MaterialsTemplates/materials');
    let getData = requester.getJSON(materialsUrl);

    Promise.all([getData, getTemplate])
        .then((result) => {
            let data = result[0],
                hbTemplate = Handlebars.compile(result[1]),
                token = window.localStorage.getItem('token');

            let template = hbTemplate({ materials: data, isTeacher: isTeacher(token) });
            $('#content').html(template);

            $('#add-material').on('click', () => {
                AddMaterialController();
            })
        })
}