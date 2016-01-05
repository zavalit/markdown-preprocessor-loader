var webpack = require('webpack');
var path = require('path');
var expect = require('expect');
var pathToLoader = path.resolve(__dirname, '../index.js');
var MemoryFS = require("memory-fs");
var fs = new MemoryFS();
var _eval = require('eval');

describe("Convert document with yaml and markdown parts into object", function(){

  it("converts @empty yamlmarkdown into empty meta, html object", function(done){

    webpackRunner('empty.js', function(output){

      expect(output.meta).toBe(null);
      expect(output.html).toBe('');

    }, done)
  })

  it("converts @complete yamlmarkdown into complete meta, html object", function(done){

    webpackRunner('complete.js', function(output){

      expect(output.meta.head.title).toBe('Test title');
      expect(output.html).toBe('<h1 id="test-title">Test title</h1>\n');

    }, done)
  })

})


function webpackRunner(entryFile, check, done){

  var compiler = webpack({

    entry: __dirname + "/" + entryFile,
    output: {
      path: __dirname,
      filename: 'bundle.js'
    },
    module: {
      loaders: [
        {test:/\.md$/, loader:pathToLoader}
      ]
    }
  });

  compiler.outputFileSystem = fs;
  compiler.run(function(err, stats) {

    if(err)
      return done(err);
    var jsonStats = stats.toJson();
    if(jsonStats.errors.length > 0)
      return done(jsonStats.errors);
    if(jsonStats.warnings.length > 0)
      done(jsonStats.warnings);

    var fileContent = fs.readFileSync(__dirname + '/bundle.js', 'utf-8');
    var output = (eval(fileContent));

    check(output);
    done();
  })
}
