import { requester } from '../utils/requester.js';
import { templates } from '../utils/templates.js';
import { isTeacher, attachEvaluationWords } from '../utils/helper.js';
import { validator } from '../utils/validator.js';
import { urls } from '../utils/urls.js';

import { notFoundController } from './notFoundController.js';

function gradesController() {
    if (!isTeacher(localStorage.getItem('elsyser-token'))) {
        requester.getJSON(urls.subjects)
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
    let gradesUrl = `${urls.grades}${currentGrade.id}/${profileId}/`;

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
    let getData = requester.getJSON(urls.classes);
    let getTemplate = templates.get('GradesTemplates/select-concrete-class');

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
                        window.location.href = `/#/grades/${el.number}/${el.letter}`;
                    });
                })
            }
        });
}


function detailedClassGradesController(classNumber, classLetter) {
    let getStudentsUrl = `${urls.students}${classNumber}/${classLetter}/`;
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
                    addGradesController(classNumber, classLetter);
                });
            });
    } else {
        notFoundController();
    }
}

function populateGrades(student) {
    let subjectId = localStorage.getItem('elsyser-teachers-subject-id');
    let gradesUrl = `${urls.grades}${subjectId}/${student.user.id}/`;

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

function addGradesController(classNumber, classLetter) {
    let getStudentsUrl = `${urls.students}${classNumber}/${classLetter}/`;
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
                detailedClassGradesController(classNumber, classLetter);
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
                let teacherSubjectId = localStorage.getItem('elsyser-teachers-subject-id')
                let sendGradesUrl = `${urls.grades}${teacherSubjectId}/${students[j].id}/`

                if (validator.grade($(`#grade-${i}`).val())) {
                    let grade = { value: $(`#grade-${i}`).val() };
                    requester.postJSON(sendGradesUrl, grade)
                        .then(() => {
                            toastr.success('Grade added successfully!');
                            detailedClassGradesController(classNumber, classLetter);
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

export let grades = {
    allGrades: gradesController,
    detailedClassGrades: detailedClassGradesController
}