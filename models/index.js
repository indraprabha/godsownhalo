'use strict';

var fs = require('fs');
var nconf = require('nconf');
nconf.file('./config/config.json');
const util = require('util');

/*var AWS = require('aws-sdk');
//AWS.config.loadFromPath('./config/aws.json');
var s3 = new AWS.S3();
s3.listBuckets(function (err, data) {
    if (err) {
        console.log("Error", err);
    } else {
        console.log("Bucket List", data.Buckets);
    }
});*/

function galleryListing() {
    var galleryDir = nconf.get('galleryDir');
    console.log('gallery photos to be picked from ' + galleryDir);
    fs.realpath(galleryDir, function (err, path) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('Gallery: ' + path);
    });

    return fetchAlbum(galleryDir, 0);
}

function fetchAlbum(path,level) {
    //console.log("Fetching album "+path);
    var albumList = [];
    var files = fs.readdirSync(path);
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (file.includes(".")) {
            if (level && file.endsWith("jpg")) {
                var imageDetails = {
                    name: file, 
                    path: path.replace("public/", ""), 
                    caption: file.replace(".jpg", "")
                };
                //console.log(util.inspect(imageDetails));
                albumList.push(imageDetails);
            }
        } else {
            var innerAlbumDetails = {
                name: file, 
                path: path.replace("public/", ""), 
                photos: fetchAlbum(path + "/" + file, 1)
            };
            //console.log(util.inspect(innerAlbumDetails));
            albumList.push(innerAlbumDetails);
        }
    }
    return albumList;
}

module.exports = function IndexModel() {
    //console.log("Gallery Details: "+ util.inspect(galleryListing(), false, null));
    return {albums: galleryListing()};
    /*return {
        albums: [
            {
                name: "Architecture", 
                photos: [
                    { name: "dal-lake-house", path: "Architecture" }, 
                    { name: "hoysala", path: "Architecture" }, 
                    { name: "hoysala-arch", path: "Architecture" }, 
            },
            {
                name: "Birds", 
                photos: [
                    { name: "ducks", path: "Birds" },
                    { name: "eagle", path: "Birds" },
                    { name: "flight", path: "Birds" },
                    { name: "hawk", path: "Birds" },
                    { name: "kingfisher", path: "Birds" },
                    { name: "pigeons", path: "Birds" },
                    { name: "sparows", path: "Birds" }
                ]
            },
            {
                name: "Flowers", 
                photos: [
                    { name: "blue", path: "Flowers" }, { name: "croton", path: "Flowers" }, { name: "lavender", path: "Flowers" }, 
                    { name: "lotus", path: "Flowers" }, { name: "lotusbuds", path: "Flowers" }, { name: "mushroom", path: "Flowers" }, 
                    { name: "passion", path: "Flowers" }, { name: "pink", path: "Flowers" }, { name: "red", path: "Flowers" },
                    { name: "redbee", path: "Flowers" }, { name: "reflection" , path: "Flowers" }, { name: "spiral", path: "Flowers" }, 
                    { name: "white" , path: "Flowers" }, { name: "yellow" , path: "Flowers" }]
            },
        ]
    };*/
};
