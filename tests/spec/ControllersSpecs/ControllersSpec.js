import { requester } from '../../../utils/requester.js';

describe('Utils tests', () => {
    
    describe('requesterTests', () => {
            
        it('should have get()', () => {
            expect(requester.get).toBeDefined();
        }); 
        
        it('should have putJSON()', () => {
            expect(requester.putJSON).toBeDefined();
        });

        it('should have getJSON()', () => {
            expect(requester.getJSON).toBeDefined();
        });

        it('should have delete()', () => {
            expect(requester.delete).toBeDefined();
        });
    });
        
});
    