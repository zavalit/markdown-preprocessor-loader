var marked = require("marked"),
    yaml = require("js-yaml");

Object.assign = Object.assign || require('object-assign');

module.exports = function (yamlmarkdown) {

    var proc = new stringProcessor(yamlmarkdown);

    proc.yamlToMeta()

    proc.markdownToHtml()

    // raw loader part
    var content = proc.getMetaAndHtml();

    this.cacheable && this.cacheable();

    this.value = content;

    return "module.exports = " + JSON.stringify(content);
};


function stringProcessor(string)
{
  this.string = string;
  this.yamlBlockRegEx = /^---([\s\S]*?)---/;
}

stringProcessor.prototype.yamlToMeta = function(){

  var yamlData = this.string.match(this.yamlBlockRegEx);
  var metaData = null;

  if(yamlData !== null && typeof(yamlData[1]) === "string"){
    metaData = yamlData[1];
  }

  try {
    this.meta = yaml.safeLoad(metaData);
  } catch (e) {
    throw e;
  }

}

stringProcessor.prototype.markdownToHtml = function(){

  var markdown = this.string.replace(this.yamlBlockRegEx, '');
  this.html = marked(markdown);
}

stringProcessor.prototype.getMetaAndHtml = function(){

  return Object.assign({meta: this.meta}, {html: this.html})

}
