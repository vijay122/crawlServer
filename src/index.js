var express = require('express'),
    path = require('path'),
    http = require('http'),
 compression = require('compression');
var bodyParser = require('body-parser');

require('babel-core/register');

// changes for upload
var app = express();
var named = '';

var crawlCreator = require("./crawlEngine/crawlService");
var sheets = require("./repository/index");

app.use(compression({filter: shouldCompress}))
//app.use(express.static(path.join(__dirname, 'public')));


//Very important change for enabling cross domain origin ----------------Start
app.use(function(req, res, next) {
    var oneof = false;
    /*
     if(req.originalUrl !=('/login'||'/test') && req.headers['authorization'])
     {
         res.status(401).send();
     }
     */
    if(req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        //  res.header('Access-Control-Allow-Origin', "http://api.wunderground.com");
        console.log("Origin:"+req.headers.origin);
        oneof = true;
    }
    if(req.headers['access-control-request-method']) {
        res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
        oneof = true;
    }
    if(req.headers['access-control-request-headers']) {
        res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
        oneof = true;
    }
    if(oneof) {
        res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
    }

    // intercept OPTIONS method
    if (oneof && req.method == 'OPTIONS') {
        res.sendStatus(200);
    }
    else {
        next();
    }
});
//Very important change for enabling cross domain origin ----------------End


//app.configure(function () {
app.set('port', process.env.PORT || 8100);
// app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
// app.use(express.bodyParser()),
app.use(express.static(path.join(__dirname, 'public')));

// parse application/x-www-form-urlencoded
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
//app.use(express.bodyParser({limit: '50mb'}));

// parse application/json


/*Define dependencies.*/


var done = false;

/*Handling routes.*/

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'images')));
app.get('/crawlContents',crawlCreator.CrawlContents);
app.get('/crawlContentsSheets',sheets.CrawlContentsFromSheets);
app.post('/crawlContentsApi',function(request,response){
    crawlCreator.CrawlContentsApi(request.body.payload.searchItem, request.body.payload.searchParams);
});

app.get('/ping', function (request, response) {
    response.send("hi ping success");
});

var Server = http.createServer(app);

Server.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

function shouldCompress (req, res) {
    if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false
    }

    // fallback to standard filter function
    return compression.filter(req, res)
}