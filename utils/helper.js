import { requester } from './requster.js';

export function setUsernameToLocalSorage() {
    let profileUrl = 'https://elsyser.herokuapp.com/api/profile/';

    requester.getJSON(profileUrl)
        .then((data) => {
            localStorage.setItem('elsyser-username', data.username || data.user.username);
        });
}

export function isTeacher(token) {
    if (token.length === 41 && token[40] === '1') {
        return true;
    }

    return false;
}