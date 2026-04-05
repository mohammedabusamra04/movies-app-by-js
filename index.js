const http = require("http");
const fs = require("fs");
const path = "movies.json";


// Read Movies Data 
function readMovies(callback) {
    fs.readFile(path, "utf-8", (err, data) => {
        if (err) return callback(err, null);
        try {
            const movies = JSON.parse(data);
            callback(null, movies);
        } catch (parseErr) {
            callback(parseErr, null);
        }
    });
}
//Write Movies Data
function writeMovies(movies, callback) {
    fs.writeFile(path, JSON.stringify(movies, null, 2), (err) => {
        callback(err);
    });
}
// get body from Request Data
function getRequestBody(req, callback) {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
        try {
            const data = JSON.parse(body);
            callback(null, data);
        } catch (err) {
            callback(err, null);
        }
    });
}
//// Build a Node.js Server
const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Server is running");
});

const port = 2500;
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});