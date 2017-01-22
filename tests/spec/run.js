import Jasmine from '../../node_modules/jasmine/lib/jasmine.js'

var jasmine = new Jasmine()
jasmine.loadConfigFile('tests/spec/support/jasmine.json')
jasmine.execute()