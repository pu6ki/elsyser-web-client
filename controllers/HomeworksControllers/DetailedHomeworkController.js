import { requester } from '../../utils/requster.js';
import { templates } from '../../utils/templates.js';
import { EditHomeworkController } from '../HomeworksControllers/EditHomeworkController.js';
import { DeleteHomeworkController } from '../HomeworksControllers/DeleteHomeworkController.js';
import { SendHomeworkController } from './SendHomeworkController.js';
import { SubmissionsController } from './SubmissionsController.js';
import { NotFoundController } from '../NotFoundController.js';

export function DetailedHomeworkController(id) {
    let homeworkUrl = `https://elsyser.herokuapp.com/api/homeworks/${id}/`,
        getData = requester.getJSON(homeworkUrl),
        getTemplate = templates.get('HomeworksTemplates/detailed-homework'),
        currentUser = localStorage.getItem('elsyser-username');

    Promise.all([getData, getTemplate])
        .then((result) => {
            let data = result[0];

            if (currentUser === data.author.user.username) {
                data.editable = true;
            }

            let hbTemplate = Handlebars.compile(result[1]),
                template = hbTemplate(data);

            $('#content').html(template);

            $(`#homework-${id}-edit`).on('click', () => {
                EditHomeworkController(id);
            })

            $(`#homework-${id}-delete`).on('click', () => {
                alertify.confirm("Are you sure you want to delete this homework?", () => {
                    DeleteHomeworkController(id);
                })
            })

            $('#send-homework-button').on('click', () => {
                SendHomeworkController(id);
            })

            viewSentHomework(id);

            $('#submissions-button').on('click', () => {
                SubmissionsController(id);
            })
        }).catch((err) => {
            console.log(err);
            NotFoundController();
        });
}

function viewSentHomework(id) {
    let submissionsUrl = `https://elsyser.herokuapp.com/api/homeworks/${id}/submissions/`,
        getData = requester.getJSON(submissionsUrl),
        getTemplate = templates.get('HomeworksTemplates/detailed-submission');

    
    Promise.all([getData, getTemplate])
        .then((result) => {
            let data = result[0][0],
                hbTemplate = Handlebars.compile(result[1]),
                template = hbTemplate(data);

            $('#sent-homework').html(template);
        })
}