import { requester } from '../../utils/requester.js';
import { MaterialsController } from './MaterialsController.js';

const materialsUrl = 'https://elsyser.herokuapp.com/api/materials';

export function DeleteMaterialController(subjectId, materialId) {
    let deleteMaterialUrl = `${materialsUrl}/${subjectId}/${materialId}/`;

    requester.delete(deleteMaterialUrl)
        .then(() => {
            toastr.success('Deleted successfully!');
            MaterialsController();
        }).catch(() => {
            toastr.error('Can\'t delete the selected material!');
        });
}