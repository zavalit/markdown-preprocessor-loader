var splitByMeta = require('./yaml-render.js').splitByMeta;

function pygmentHighlight(code, lang, callback) {

    require('pygmentize-bundled')({ lang: lang, format: 'html' }, code, function(err, result){
      callback(err, result.toString())
    });

}
module.exports.pygmentHighlight = pygmentHighlight;

module.exports.coursesPygmentHighlight = function (code, lang, callback){
        var extendedCodes = ['repl', 'editor', 'editor+repl'];
        if(typeof(lang) === "undefined" || extendedCodes.indexOf(lang.toLowerCase())>=0) {
          callback(null, code);
          return;
        }

        pygmentHighlight(code, lang, callback);
  };

function replCodeExtension(code, lang, escaped) {


    if (!lang) {
      return '<pre><code>'
        + code
        + '\n</code></pre>';
    }

    var markup = "";
    var idSuffix = getIdSuffix(code);
    switch (lang.toLowerCase()) {
      case 'repl':

      var data = splitByMeta(code);
      markup = '<div id="repl_'+ idSuffix +'" class="repl" data-meta="'+ escapeJson(JSON.stringify(data.meta)) +'">'
        + escapeContent(data.tail)
        + '\n</div>';
        break;
      case 'editor+repl':
      var data = splitByMeta(code);

      markup = '<div id="editor_'+ idSuffix
        + '" class="editor" >'
        + escapeContent(data.tail)
        + '\n</div>'
        + '\n<div id="repl_' + idSuffix  +'" class="repl" data-meta="'+ escapeJson(JSON.stringify(data.meta)) +'">'

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


function getIdSuffix(code){
  var idSuffix = getCodeIndex();

  var data = splitByMeta(code);

  if(data && data.meta && data.meta.id_suffix) {
    idSuffix = data.meta.id_suffix;
  }

  return idSuffix;

}

function getCodeIndex(){
  if(typeof(this.codeIndex) === "undefined"){
    this.codeIndex = 0;
  }
  return ++this.codeIndex;
}


function escapeJson(json) {
  return json
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeContent(content){
  return  content.replace(/</g, '&lt;');
}



module.exports.replCodeExtension = replCodeExtension;
