var Crawler = require("crawler");
var httpUtils = require("../httpUtilities");


function SaveTemporaryData(payload)
{
    httpUtils.fetchData("http://localhost:8000/Save","POST",payload)
}


// Queue just one URL, with default callback
exports.CrawlContents = function(req,res) {
    var c =new Crawler({
        maxConnections : 10,
        // This will be called for each crawled page
        callback : function (error, res, done) {
            if(error){
                console.log(error);
            }else{
                var $ = res.$;
                var coordinates = $(".geo").first().text().trim().split(";");
                // $ is Cheerio by default
                //a lean implementation of core jQuery designed specifically for the server
                console.log($("#firstHeading").text());
                console.log("coordinates:"+$(".geo").first().text().trim());
                console.log("country:"+$(".flagicon").next().text());
               // console.log("Country:"+$(".infobox.geography.vcard .mergedtoprow").children("td:not(div)").eq(2).text().trim());
                console.log("state:"+$(".infobox.geography.vcard .mergedrow").children('td').eq(0).text().trim());
                console.log("city:"+$(".infobox.geography.vcard .mergedrow").children('td').eq(1).text().trim());
                console.log("pincode:222222");
                console.log("description:"+$(".infobox.geography.vcard").parent().children('p').slice(0,2).text());
                console.log("landmark:"+$(".infobox.geography.vcard").parent().children('p').slice(2,6).text());


                var payload ={};
               // payload._id= Math.floor((Math.random() * 100000) + 1);
                payload.name = $("#firstHeading").text();
                payload.country = $(".flagicon").next().text();
                payload.state = $(".infobox.geography.vcard .mergedrow").children('td').eq(0).text().trim();
                payload.city = $(".infobox.geography.vcard .mergedrow").children('td').eq(1).text().trim();
                payload.pincode = 222222;
                payload.description = $(".infobox.geography.vcard").parent().children('p').slice(0,2).text();
                payload.landmark = $(".infobox.geography.vcard").parent().children('p').slice(2,6).text();
                payload.latitude = coordinates[0];
                payload.longitude = coordinates[1];
                payload.type="standalone";
                    payload.isValidated=false;
                //"loc" : { "coordinates" : [ 77.23306, 9.58194 ], "type" : "Point" }

                SaveTemporaryData(JSON.stringify({payload:payload}));
            }
            done();
        }
    });
   // c.queue('https://en.wikipedia.org/wiki/');

    c.queue(['https://en.wikipedia.org/wiki/kanyakumari','https://en.wikipedia.org/wiki/velachery','https://en.wikipedia.org/wiki/vandaloor','https://en.wikipedia.org/wiki/candolim']);
}