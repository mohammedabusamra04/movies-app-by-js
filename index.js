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