var Metalsmith  = require('metalsmith'),
    markdown    = require('metalsmith-markdown'),
    templates   = require('metalsmith-templates'),
    collections = require('metalsmith-collections'),
    permalinks  = require('metalsmith-permalinks'),
    Handlebars  = require('handlebars'),
    fs          = require('fs');

// Read in the partial templates
var partials = fs.readdirSync(__dirname + '/templates/partials');

for(var i in partials) {
    var name = partials[i].replace('.hbt', '');
    Handlebars.registerPartial(name, fs.readFileSync(__dirname + '/templates/partials/' + partials[i]).toString());
}

Handlebars.registerHelper("log", function(context) {
  return console.log(context);
});

// Building out the site

Metalsmith(__dirname)
    .use(collections({
        blog: {
            pattern: 'posts/*.md',
            sortBy: 'date',
            reverse: true
        }
    }))
    .use(markdown())
    .use(permalinks({ pattern: ':collection/:url' }))
    .use(templates('handlebars'))
    .destination('./dist')
    .build(function(err, files){
            if (err){ console.log(err, files); }
        });
