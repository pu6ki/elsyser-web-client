SystemJS.config({
 transpiler: 'plugin-babel',
 map: {
  'plugin-babel': 
  '../../bower_components/systemjs-plugin-babel/plugin-babel.js',
  'systemjs-babel-build': 
  '../../bower_components/systemjs-plugin-babel/systemjs-babel-browser.js',

  'main': '../../app.js'
 }
});