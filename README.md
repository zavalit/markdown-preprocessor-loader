[![Build Status](https://travis-ci.org/zavalit/yaml-markdown-loader.svg)](https://github.com/zavalit/yaml-markdown-loader)
# Yaml and Markdown webpack loader.

### Why
Sometimes you want to generate a complete html page out of your markdown file, but markdown is just not enough for an html page, you also need a bunch of meta information about your page (like *title* and etc.), that you want to control somehow. For that purpose you are know able to do it like this:

```
---
head:
  title: Test title
  meta-description: Page to get a test information
---
# Test title

 your awesome markdown content

```
The area between two ```---``` is nothing else as a **Yaml** and everything below is your actual **Markdown**.

An output that will be generated is equal to a following JSON object:
```
{ meta:
   { head:
      { title: 'Test title',
        'meta-description': 'Page to get a test information'
      }
   },
  html: '<h1 id="test-title">Test title</h1>\n<p> your awesome markdown content</p>\n'
}
```

### Configuration

Your ```webpack.config.js``` can look like this:

```
entry: __dirname + '/entry.js',
output: {
  path: __dirname,
  filename: 'bundle.js'
},
module: {
  loaders: [
    {test:/\.md$/, loader:'yaml-markdown'}
  ]
}
```

### To Do

 - enable loader queries
 - enable markdown custom options
