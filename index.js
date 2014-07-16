'user strict';
var Metalsmith  = require('metalsmith'),
    markdown    = require('metalsmith-markdown'),
    templates   = require('metalsmith-templates'),
    collections = require('metalsmith-collections'),
    paginate    = require('metalsmith-paginate'),
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

Handlebars.registerHelper('limit', function(collection, limit, start) {
    var out   = [],
        i, c;
 
    start = start || 0;
 
    for (i = c = 0; i < collection.length; i++) {
        if (i >= start && c < limit+1) {
            out.push(collection[i]);
            c++;
        }
    }
 
    return out;
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
    .use(paginate({
        perPage: 2,
        path: "blog/page"
    }))
    .use(markdown())
    .use(permalinks({ pattern: ':collection/:url' }))
    .use(templates('handlebars'))
    .destination('./dist')
    .build(function(err, files){
            if (err){ console.log(err, files); }
        });
