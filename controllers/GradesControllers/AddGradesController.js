import { requester } from '../../utils/requester.js';
import { templates } from '../../utils/templates.js';
import { isTeacher } from '../../utils/helper.js';
import { validator } from '../../utils/validator.js';

import { DetailedClassGradesController } from './DetailedClassGradesController.js';

export function AddGradesController(classNumber, classLetter) {
    let getStudentsUrl = `https://elsyser.herokuapp.com/api/students/${classNumber}/${classLetter}/`;
    let getStudents = requester.getJSON(getStudentsUrl);
    let getTemplate = templates.get('GradesTemplates/add-grades');
    let getPartialFormField = templates.get('partials/grade-form-field');
    let currentClass = { classNumber, classLetter };

    Promise.all([getStudents, getTemplate, getPartialFormField])
        .then((result) => {
            let studentsInClass = result[0];
            let hbTemplate = Handlebars.compile(result[1]);
            let template = hbTemplate({ studentsInClass, currentClass });
            let partialData = { numOfFields: 1 };

            let hbPartial = Handlebars.compile(result[2]);
            let partialFormField = hbPartial(partialData);

            let autocompleteOptions = {
                data: getStudentsFullNameAndId(studentsInClass),
                getValue: 'fullName'
            }

            $('#content').html(template);

            $('#go-back').on('click', () => {
                DetailedClassGradesController(classNumber, classLetter);
            });

            $('#student-name-0').easyAutocomplete(autocompleteOptions);

            $('#add-another-grade-button').on('click', () => {
                $('#grades').append(partialFormField);
                $(`#student-name-${partialData.numOfFields}`).easyAutocomplete(autocompleteOptions);
                partialData.numOfFields++;
                partialFormField = hbPartial(partialData);
            });

            $('#add-grades-button').on('click', () => {
                sendGrades(autocompleteOptions.data, classNumber, classLetter);
            })
        });
}

function getStudentsFullNameAndId(studentsInClass) {
    let data = [];

    studentsInClass.forEach((el) => {
        data.push({
            fullName: `${el.user.first_name} ${el.user.last_name}`,
            id: el.user.id
        });
    });

    return data;
}

function sendGrades(students, classNumber, classLetter) {
    let len = $('.student-name').length;
    for (let i = 0; i < len; i += 1) {
        for (let j = 0; j < students.length; j += 1) {
            if ($(`#student-name-${i}`).val() === students[j].fullName) {
                let sendGradesUrl = `https://elsyser.herokuapp.com/api/grades/${localStorage.getItem('elsyser-teachers-subject-id')}/${students[j].id}/`

                if (validator.grade($(`#grade-${i}`).val())) {
                    let grade = { value: $(`#grade-${i}`).val() };
                    requester.postJSON(sendGradesUrl, grade)
                        .then(() => {
                            toastr.success('Grades added successfully!');
                            DetailedClassGradesController(classNumber, classLetter);
                        })
                        .catch(() => {
                            toastr.error('Couldn\'t add grades! Please check if they\'re valid.');
                        });
                } else {
                    toastr.error('Invalid grades.');
                }
            }
        }
    }
}
