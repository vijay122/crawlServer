var Crawler = require("crawler");



// Queue just one URL, with default callback
exports.CrawlContents = function(req,res) {
    var c = new Crawler({
        maxConnections : 10,
        // This will be called for each crawled page
        callback : function (error, res, done) {
            if(error){
                console.log(error);
            }else{
                var $ = res.$;
                // $ is Cheerio by default
                //a lean implementation of core jQuery designed specifically for the server
                console.log($("title").text());
            }
            done();
        }
    });
    c.queue('http://www.amazon.com');
}