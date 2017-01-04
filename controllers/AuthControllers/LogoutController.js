import { HeaderController } from '../HeaderController.js';

export function LogoutController() {
    toastr.success('Logged-out successfully!');
    localStorage.removeItem('token');
    localStorage.removeItem('elsyser-username');
    localStorage.removeItem('elsyser-id');
    HeaderController();
    window.location.href = '/#/home';
    window.location.reload(true);
}
