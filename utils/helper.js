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