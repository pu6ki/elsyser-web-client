import { requester } from './requster.js';

export function setUsernameToLocalSorage() {
    let profileUrl = 'https://elsyser.herokuapp.com/api/profile/';

    requester.getJSON(profileUrl)
        .then((data) => {
            localStorage.setItem('elsyser-username', data.user.username);
        });
}