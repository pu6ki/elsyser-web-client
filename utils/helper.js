import { requester } from './requester.js';

export function isTeacher(token) {
    if (token.length === 41 && token[40] === '1') {
        return true;
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