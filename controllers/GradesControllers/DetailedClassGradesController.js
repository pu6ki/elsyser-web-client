import { requester } from '../../utils/requester.js';
import { templates } from '../../utils/templates.js';
import { isTeacher, attachEvaluationWords } from '../../utils/helper.js';

import { AddGradesController } from './AddGradesController.js';

import { NotFoundController } from '../NotFoundController.js';

export function DetailedClassGradesController(classNumber, classLetter) {
    let getStudentsUrl = `https://elsyser.herokuapp.com/api/students/${classNumber}/${classLetter}/`;
    let getStudents = requester.getJSON(getStudentsUrl);
    let getTemplate = templates.get('GradesTemplates/class-grades');
    let currentClass = { classNumber, classLetter };

    if (isTeacher(localStorage.getItem('elsyser-token'))) {
        Promise.all([getStudents, getTemplate])
            .then((result) => {
                let studentsInClass = result[0];

                studentsInClass.sort((a, b) => {
                    let firstNameA = a.user.first_name.toUpperCase();
                    let firstNameB = b.user.first_name.toUpperCase();
                    let lastNameA = a.user.last_name.toUpperCase();
                    let lastNameB = b.user.last_name.toUpperCase();

                    if (firstNameA < firstNameB) {
                        return -1;
                    }
                    else if (firstNameA > firstNameB) {
                        return 1;
                    }
                    else {
                        if (lastNameA < lastNameB) {
                            return -1;
                        }
                        else if (lastNameA > lastNameB) {
                            return 1;
                        }
                        else {
                            return 0;
                        }
                    }
                });

                for (let i = 0; i < studentsInClass.length; i += 1) {
                    studentsInClass[i].classNumber = i + 1;
                }

                let hbTemplate = Handlebars.compile(result[1]);
                let template = hbTemplate({ studentsInClass, currentClass });
                $('#content').html(template);

                studentsInClass.forEach((student) => {
                    populateGrades(student);
                });

                $('#add-grades').on('click', () => {
                    AddGradesController(classNumber, classLetter);
                });
            });
    } else {
        NotFoundController();
    }
}

function populateGrades(student) {
    let subjectId = localStorage.getItem('elsyser-teachers-subject-id');
    let gradesUrl = `https://elsyser.herokuapp.com/api/grades/${subjectId}/${student.user.id}/`;

    requester.getJSON(gradesUrl)
        .then((grades) => {
            let avg = 0.0,
                i = 0;
            for (i = 0; i < grades.length; i += 1) {
                avg += grades[i].value;
                $(`#${grades[i].student.user.username}-grades`).append(`<span>${grades[i].value} </span>`);
            }
            avg /= (grades.length);
            avg = avg.toFixed(2);
            avg = attachEvaluationWords(avg);
            $(`#${grades[i - 1].student.user.username}-average-grade`).html(`<span class="text-center">${avg}</span>`);
        });
}