import { requester } from './requester.js';

export function isTeacher(token) {
    if (token) {
        if (token.length === 41 && token[40] === '1') {
            return true;
        }
    }

    return false;
}

export function insertLineBreaks(content) {
    return content.replace(/[\n]/g, '<br />');
}

export function setTeacherSubjectToLocalStorage() {
    const profileUrl = `https://elsyser.herokuapp.com/api/profile/${localStorage.getItem('elsyser-id')}/`;
    requester.getJSON(profileUrl)
        .then((result) => {
            localStorage.setItem(`elsyser-teachers-subject-id`, result.subject.id);
        })
}

export function attachEvaluationWords(mark) {
    if (mark <= 6.00 && mark >= 5.50) { return `Excellent ${mark}` }
    else if (mark < 5.50 && mark >= 4.50) { return `Very Good ${mark}` }
    else if (mark < 4.50 && mark >= 3.50) { return `Good ${mark}` }
    else if (mark < 3.50 && mark >= 3.00) { return `Average ${mark}` }
    else { return `Poor ${mark}` }
}

export function setNewsUrl() {
    return isTeacher(localStorage.getItem('elsyser-token')) ? 
    'https://elsyser.herokuapp.com/api/news/teachers/' :
    'https://elsyser.herokuapp.com/api/news/students/';
}