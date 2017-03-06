import { HeaderController } from '../HeaderController.js';
import { HomeController } from '../HomeController.js';

export function LogoutController() {
    toastr.success('Logged-out successfully!');
    localStorage.removeItem('elsyser-token');
    localStorage.removeItem('elsyser-username');
    localStorage.removeItem('elsyser-id');
    localStorage.removeItem('elsyser-teachers-subject-id');
    HeaderController();
    if (window.location.href === '/#/home') {
        HomeController();
    } else {
        window.location.href = '/#/home';
        HomeController();
    }
}
