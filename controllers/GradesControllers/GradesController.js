import { requester } from '../../utils/requester.js';
import { templates } from '../../utils/templates.js';
import { isTeacher } from '../../utils/helper.js';

export function GradesController() {
    const subjectsUrl = 'https://elsyser.herokuapp.com/api/subjects/';
    const classesUrl = 'https://elsyser.herokuapp.com/api/classes/${number}';

    // TODO: Use URL from API to visualize classes
    
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
        $('#content').html(`
            <div class="panel panel-default">
                <div class="panel-body">
                    <h2 class="text-center">Select class</h2>
                </div>
            </div>
        `);

        templates.get('GradesTemplates/select-class')
            .then(result => {
                let classes = ['A', 'B', 'V', 'G'];

                for (let number = 8; number <= 12; number += 1) {
                    $('#content').append(`<div class="text-center class-heading">${number}th class</div>`);

                    for (let i = 0; i < 4; i += 1) {
                        let data = {
                            number,
                            letter: classes[i]
                        };
                        let hbTemplate = Handlebars.compile(result);
                        let template = hbTemplate(data);
                        $('#content').append(template);

                        $(`#${number}${classes[i]}`).on('click', () => {
                            window.location.href = `#/grades/${number}/${classes[i]}`;
                            //ViewClassGradesController(number, letter);
                        })
                    }
                }
            });
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

                data.average = attachEvaluationWords(average / data.length);
            }
            $('#content').append(hbTemplate(data));
        });
}

function attachEvaluationWords(mark) {
    if (mark <= 6.00 && mark >= 5.50) { return `Excellent ${mark}` }
    else if (mark < 5.50 && mark >= 4.50) { return `Very Good ${mark}` }
    else if (mark < 4.50 && mark >= 3.50) { return `Good ${mark}` }
    else if (mark < 3.50 && mark >= 3.00) { return `Average ${mark}` }
    else { return `Poor ${mark}` }
}


// let classUrl = `https://elsyser.aerobatic.io/api/students/${number}/${letter}/`;
// let data = {
//     class: number + letter,
//     students: null
// };
