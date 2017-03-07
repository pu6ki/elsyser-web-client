import { requester } from '../../utils/requester.js';
import { templates } from '../../utils/templates.js';
import { isTeacher, attachEvaluationWords } from '../../utils/helper.js';

export function GradesController() {
    const subjectsUrl = 'https://elsyser.herokuapp.com/api/subjects/';

    if (!isTeacher(localStorage.getItem('elsyser-token'))) {
        requester.getJSON(subjectsUrl)
            .then(subjects => {
                return subjects;
            }).then(subjects => {
                $('#content').html('');
                subjects.forEach(el => {
                    visualizeGradesForSubject(el);
                });
            });
    } else {
        studensGradesController();
    }
}

function visualizeGradesForSubject(currentGrade) {
    let profileId = localStorage.getItem('elsyser-id');
    let gradesUrl = `https://elsyser.herokuapp.com/api/grades/${currentGrade.id}/${profileId}/`;

    let getData = requester.getJSON(gradesUrl),
        getTemplate = templates.get('GradesTemplates/grades');

    Promise.all([getData, getTemplate])
        .then((result) => {
            let data = result[0],
                hbTemplate = Handlebars.compile(result[1]);

            if (data) {
                data.title = data[0].subject.title;

                let average = 0.0;

                data.forEach(el => {
                    average += el.value;
                    el.value = attachEvaluationWords(el.value);
                });

                average /= data.length;
                average = average.toFixed(2);
                data.average = attachEvaluationWords(average);
            }
            $('#content').append(hbTemplate(data));
        });
}

function studensGradesController() {
    let classesUrl = 'https://elsyser.herokuapp.com/api/classes/';
    let getData = requester.getJSON(classesUrl);
    let getTemplate = templates.get('GradesTemplates/select-class');

    $('#content').html(`
            <div class="panel panel-default">
                <div class="panel-body">
                    <h2 class="text-center">Select class</h2>
                </div>
            </div>
        `);

    Promise.all([getData, getTemplate])
        .then(result => {
            let data = result[0];
            let hbTemplate = Handlebars.compile(result[1]);

            for (let classNumber in data) {
                $('#content').append(`<div class="text-center class-heading">${classNumber}th class</div>`);
                data[classNumber].forEach((el) => {
                    let data = {
                        number: el.number,
                        letter: el.letter
                    };
                    let template = hbTemplate(data);
                    $('#content').append(template);

                    $(`#${el.number}${el.letter}`).on('click', () => {
                        window.location.href = `#/grades/${el.number}/${el.letter}`;
                    });
                })
            }
        });
}