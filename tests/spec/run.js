import Jasmine from 'jasmine'

var jasmine = new Jasmine()
jasmine.loadConfigFile('tests/spec/support/jasmine.json')
jasmine.execute()