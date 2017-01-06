import { HeaderController } from '../HeaderController.js';
import { HomeController } from '../HomeController.js';

export function LogoutController() {
    toastr.success('Logged-out successfully!');
    localStorage.removeItem('token');
    localStorage.removeItem('elsyser-username');
    localStorage.removeItem('elsyser-id');
    HeaderController();
    HomeController();
}
