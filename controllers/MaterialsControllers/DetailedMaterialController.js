import { requester } from '../../utils/requster.js';
import { templates } from '../../utils/templates.js';
import { EditMaterialController } from './EditMaterialController.js';
import { DeleteMaterialController } from './DeleteMaterialController.js';
import { NotFoundController } from '../NotFoundController.js';

export function DetailedMaterialController(subjectId, materialId) {
    let materialUrl = `https://elsyser.herokuapp.com/api/materials/${subjectId}/${materialId}/`,
        getData = requester.getJSON(materialUrl),
        getTemplate = templates.get('MaterialsTemplates/detailed-material'),
        currentUser = localStorage.getItem('elsyser-username');

    Promise.all([getData, getTemplate])
        .then((result) => {
            let data = result[0];

            if (currentUser === data.author.user.username) {
                data.editable = true;
            }
            
            data.content = insertLineBreaks(data.content);

            data.video_url = makeYouTubeVideoEmbedable(data.video_url);

            let hbTemplate = Handlebars.compile(result[1]),
                template = hbTemplate(data);

            $('#content').html(template);

            $(`#material-${materialId}-edit`).on('click', () => {
                EditMaterialController(subjectId, materialId);
            })

            $(`#material-${materialId}-delete`).on('click', () => {
                DeleteMaterialController(subjectId, materialId);
            })
        }).catch((err) => {
            NotFoundController();
        })
}

function makeYouTubeVideoEmbedable(videoUrl) {
    let youtubeUrl = 'www.youtube.com/',
        index = videoUrl.indexOf(youtubeUrl) + youtubeUrl.length,
        result = videoUrl.slice(0, index) + 'embed/' + videoUrl.slice(index);

    return result.replace('watch?v=', '');
}

function insertLineBreaks(content) {
    return content.replace(/[\n]/g, '<br />');
}