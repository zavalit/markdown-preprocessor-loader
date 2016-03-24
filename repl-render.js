var splitByMeta = require('./yaml-render.js').splitByMeta;

function pygmentHighlight(code, lang, callback) {

    require('pygmentize-bundled')({ lang: lang, format: 'html' }, code, function(err, result){
      console.log(err);
      callback(err, result.toString())
    });

}
module.exports.pygmentHighlight = pygmentHighlight;

module.exports.coursesPygmentHighlight = function (code, lang, callback){
        var extendedCodes = ['repl', 'editor', 'editor+repl'];
        if(extendedCodes.indexOf(lang.toLowerCase())>=0) {
          callback(null, code);
          return;
        }

        pygmentHighlight(code, lang, callback);
  };



module.exports.replCodeExtension = function(code, lang, escaped) {


    if (!lang) {
      return '<pre><code>'
        + (escaped ? code : escape(code, true))
        + '\n</code></pre>';
    }

    var markup = "";

    switch (lang.toLowerCase()) {
      case 'repl':
      var data = splitByMeta(code);
      markup = '<div id="repl_' +'" class="repl" data-meta="'+ escape(JSON.stringify(data.meta)) +'">'
        + data.tail
        + '\n</div>';
        break;
      case 'editor+repl':
      var data = splitByMeta(code);
      markup = '<div id="editor_'
        + '" class="editor" >'
        + data.tail
        + '\n</div>'
        + '\n<div id="repl_' +'" class="repl" data-meta="'+ escape(JSON.stringify(data.meta)) +'">'
        + '\n</div>';
      break;
      default:
       markup = '<pre><code class="'
        + this.options.langPrefix
        + escape(lang, true)
        + '">'
        + (escaped ? code : escape(code, true))
        + '\n</code></pre>\n';
    }

    return markup;

}
