var marked = require("section-marked"),
    loaderUtils = require("loader-utils"),
    coursesPygmentHighlight = require("./repl-render.js").coursesPygmentHighlight,
    pygmentHighlight = require("./repl-render.js").pygmentHighlight,
    replCodeExtension = require("./repl-render.js").replCodeExtension,
    splitByMeta = require('./yaml-render.js').splitByMeta;

Object.assign = Object.assign || require('object-assign');


module.exports = function (markdownString) {

    var loaderCallback = this.async();

    var options = buildOptions(this.query);

    var data = splitByMeta(markdownString, /^---([\s\S]*?)---/)

    var sp = new stringProcessor(data.meta, data.tail);

    sp.exec(options, loaderCallback)

};

function buildOptions(query)
{
  var query = loaderUtils.parseQuery(query);
  // default option
  var options = {
      renderer: new marked.Renderer()
  };

  options = Object.assign({}, options, query);

  if(options.codeRenderer){
    options.renderer.code = eval(options.codeRenderer);
  }
  if(options.highlight){
    options.highlight = eval(options.highlight)
  }else{
    optionhighlight = pygmentHighlight;
  }
  return options;
}



function stringProcessor(meta, md)
{
  this.meta = meta;
  this.md = md;
}


stringProcessor.prototype.exec = function(options, loaderCallback) {

  var self = this;

  marked.setOptions(options);

  marked(self.md, function(err, out){
    self.html = out;
    loaderCallback(err, self.toJson());
  });

}

stringProcessor.prototype.toJson = function() {

  return JSON.stringify({html:this.html, meta:this.meta});

}
