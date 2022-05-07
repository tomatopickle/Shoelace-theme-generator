// This is simple server to run the build files in case I want to see the site in production
var fs = require('fs'),
    http = require('http');

http.createServer(function (req, res) {
    fs.readFile(__dirname + "/public" + (req.url == "/" ? "/index.html" : req.url), function (err, data) {
        if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }
        res.writeHead(200);
        res.end(data);
    });
}).listen(8080);