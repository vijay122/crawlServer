var Crawler = require("crawler");
var httpUtils = require("../httpUtilities");
var http = require('http');


function SaveTemporaryData(payload)
{
    return new Promise((resolve, reject) => {
        httpUtils.fetchData("http://localhost:8000/Save", "POST", payload).then(response => {
            resolve(response);
        });
    });
}

exports.CrawlContentsApi = function(searchItem,searchParam) {
    return new Promise((resolve, reject) => {
        getTitle(searchItem).then(titlesArray => {
            getUrl(titlesArray,searchItem, searchParam).then(url => {
                crawlUrlAndSave(url).then(result=>{
                    resolve(result);
                });
            })
        })
    });
}

const crawlUrlAndSave=(url)=>{
   // return new Promise((resolve, reject) => {
        var c = new Crawler({
            maxConnections: 10,
            // This will be called for each crawled page
            callback: function (error, res, done) {
                if (error) {
                    console.log(error);
                } else {
                    var $ = res.$;
                    var coordinates = $(".geo").first().text().trim().split(";");
                    // $ is Cheerio by default
                    //a lean implementation of core jQuery designed specifically for the server
                    console.log($("#firstHeading").text());
                    console.log("coordinates:" + $(".geo").first().text().trim());
                    console.log("country:" + $(".flagicon").next().text());
                    // console.log("Country:"+$(".infobox.geography.vcard .mergedtoprow").children("td:not(div)").eq(2).text().trim());
                    console.log("state:" + $(".infobox.geography.vcard .mergedrow").children('td').eq(0).text().trim());
                    console.log("city:" + $(".infobox.geography.vcard .mergedrow").children('td').eq(1).text().trim());
                    console.log("pincode:222222");
                    console.log("description:" + $(".infobox.geography.vcard").parent().children('p').slice(0, 2).text());
                    console.log("landmark:" + $(".infobox.geography.vcard").parent().children('p').slice(2, 6).text());


                    var payload = {};
                    // payload._id= Math.floor((Math.random() * 100000) + 1);
                    payload.name = $("#firstHeading").text();
                    payload.country = $(".flagicon").next().text();
                    payload.state = $(".infobox.geography.vcard .mergedrow").children('td').eq(0).text().trim();
                    payload.city = $(".infobox.geography.vcard .mergedrow").children('td').eq(1).text().trim();
                    payload.pincode = 222222;
                    payload.description = $(".infobox.geography.vcard").parent().children('p').slice(0, 2).text();
                    payload.landmark = $(".infobox.geography.vcard").parent().children('p').slice(2, 6).text();
                    payload.latitude = coordinates[0];
                    payload.longitude = coordinates[1];
                    payload.type = "standalone";
                    payload.isValidated = false;
                    //"loc" : { "coordinates" : [ 77.23306, 9.58194 ], "type" : "Point" }

                    SaveTemporaryData(JSON.stringify({payload: payload})).then(data=> {
                        if(data) {
                            done();
                        }
                        });
                   // resolve({saved:true});
                }
            }
        });
   // });
     c.queue(url);
}

const getTitle=(findItemName)=>
{
    return new Promise((resolve, reject) => {
         httpUtils.fetchData("https://en.wikipedia.org/w/api.php?action=opensearch&search=" + findItemName + "&limit=5&namespace=0&format=json", "GET", {}).then(function(x){
             resolve(x);
         })


    });
}

const getUrl=(result,searchItem,searchParams)=>{
    return new Promise((resolve, reject) => {
        let descriptionsArray = result[2];
        let pickUrl ="";
        if (descriptionsArray && descriptionsArray.length >0 ) {
            for(var i=0;i<descriptionsArray.length; i++)
            {
                if(descriptionsArray[i].indexOf(searchParams)>0)
                {
                    pickUrl = result[3][i];
                    resolve(pickUrl);
                    break;
                }
            }
        }
    });
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
    //c.queue(['https://en.wikipedia.org/wiki/Poovar Island','https://en.wikipedia.org/wiki/Padmanabhapuram Palace','https://en.wikipedia.org/wiki/Puthenmalika Palace','https://en.wikipedia.org/wiki/Agastya Mala','https://en.wikipedia.org/wiki/Thiruvananthapuram Zoo','https://en.wikipedia.org/wiki/Shanghumukham Beach','https://en.wikipedia.org/wiki/Priyadarshini Planetarium','https://en.wikipedia.org/wiki/Santhigiri Ashram',]);
}