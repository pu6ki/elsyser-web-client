import { requester } from '../../utils/requester.js';
import { templates } from '../../utils/templates.js';
import { isTeacher } from '../../utils/helper.js';

export function GradesController() {
    const subjectsUrl = 'https://elsyser.herokuapp.com/api/subjects/';

    if (!isTeacher(localStorage.getItem('elsyser-token'))) {
        requester.getJSON(subjectsUrl)
            .then(subjects => {
                return subjects;
            }).then((subjects) => {
                $('#content').html('');
                subjects.forEach(el => {
                    let profileId = localStorage.getItem('elsyser-id');
                    let gradesUrl = `https://elsyser.herokuapp.com/api/grades/${el.id}/${profileId}/`;

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
                });
            });
    }
}

function attachEvaluationWords(mark) {
    if (mark <= 6.00 && mark >= 5.50) { return `Excellent ${mark}` }
    else if (mark < 5.50 && mark >= 4.50) { return `Very Good ${mark}` }
    else if (mark < 4.50 && mark >= 3.50) { return `Good ${mark}` }
    else if (mark < 3.50 && mark >= 3.00) { return `Average ${mark}` }
    else { return `Poor ${mark}` }
}