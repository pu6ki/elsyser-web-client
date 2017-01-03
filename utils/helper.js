import { requester } from './requster.js';


export function isTeacher(token) {
    if (token.length === 41 && token[40] === '1') {
        return true;
    }

    return false;
}