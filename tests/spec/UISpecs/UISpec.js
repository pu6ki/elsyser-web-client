describe('UI tests', () => {
    beforeEach(() => {
        this.requester = (url) => {
            let promise = new Promise((resolve, reject) => {
                $.ajax({
                    url,
                    method: "GET",
                    success(response) {
                        return resolve(response);
                    },
                    error(response) {
                        return reject(response);
                    }
                });
            });
            return promise;
        };
        this.loadTemplate = (name) => {
            let url = `../../templates/${name}.handlebars`;
            return this.requester(url);
        }
    });

    describe('Test unauthorized-home', () => {

        it('template should be loaded correctly', (done) => {
            this.loadTemplate('HomeTemplates/unauthorized-home').then((res) => {
                let hbTemplate = Handlebars.compile(res),
                    template = hbTemplate();
                setFixtures(template);
                expect($('#home-logo')).toBeInDOM();
                expect($('#info')).toContainText('This is your school but in the cloud!');
                done();
            }).catch((err) => {
                console.log(err);
            })

        });

    });


    describe('Test authorized-home', () => {

        it('template should be loaded correctly', (done) => {
            this.loadTemplate('HomeTemplates/authorized-home').then((res) => {
                let hbTemplate = Handlebars.compile(res),
                    template = hbTemplate();
                setFixtures(template);
                expect($('#home-logo')).toBeInDOM();
                expect($('.intro-message h3')).toContainText('Dashboard');
                expect($('#homeworks-panel')).toBeInDOM();
                expect($('#exams-panel')).toBeInDOM();
                expect($('#materials-panel')).toBeInDOM();
                done();
            }).catch((err) => {
                console.log(err);
            })
        });

    });


    describe('Test unauthorized-header', () => {

        it('template should be loaded correctly', (done) => {
            this.loadTemplate('HeaderTemplates/unauthorized-header').then((res) => {
                let hbTemplate = Handlebars.compile(res),
                    template = hbTemplate();
                setFixtures(template);
                expect($('#sign-in-buttons')).toBeInDOM();
                expect($('#log-in a')).toContainText('Log-in');
                expect($('#register a')).toContainText('Register');
                done();
            }).catch((err) => {
                console.log(err);
            });

        });

    });

});

