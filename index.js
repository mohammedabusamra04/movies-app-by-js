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
    const urlParts = req.url.split("/");
    const id = urlParts[2] ? parseInt(urlParts[2]) : null;

    // Get all movies
    if (req.method === "GET" && req.url === "/movies") {
        readMovies((err, movies) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                return res.end("Error reading file");
            }
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(movies));
        });
    }
});

const port = 2500;
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});