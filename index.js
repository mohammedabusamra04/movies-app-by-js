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
    // Get one movie by ID
    else if (req.method === "GET" && req.url.startsWith("/movies/")) {
        if (!id) {
            res.writeHead(400, { "Content-Type": "text/plain" });
            return res.end("Invalid ID");
        }

        readMovies((err, movies) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                return res.end("Error reading file");
            }

            const movie = movies.find(m => m.id === id);
            if (!movie) {
                res.writeHead(404, { "Content-Type": "text/plain" });
                return res.end("Movie not found");
            }

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(movie));
        });
    }
    // Add a new movie
    else if (req.method === "POST" && req.url === "/movies") {
        getRequestBody(req, (err, newMovie) => {
            if (err) {
                res.writeHead(400, { "Content-Type": "text/plain" });
                return res.end("Invalid JSON");
            }

            // Validation
            if (!newMovie.title) 
                return res.writeHead(400, { "Content-Type": "text/plain" }).end("Title is required");
            if (newMovie.year !== undefined && typeof newMovie.year !== "number") 
                return res.writeHead(400, { "Content-Type": "text/plain" }).end("Year must be a number");
            if (newMovie.rating !== undefined && typeof newMovie.rating !== "number") 
                return res.writeHead(400, { "Content-Type": "text/plain" }).end("Rating must be a number");
            readMovies((err, movies) => {
                if (err) 
                    return res.writeHead(500, { "Content-Type": "text/plain" }).end("Error reading file");

                newMovie.id = movies.length ? movies[movies.length - 1].id + 1 : 1;
                movies.push(newMovie);

                writeMovies(movies, (err) => {
                    if (err) 
                        return res.writeHead(500, { "Content-Type": "text/plain" }).end("Error writing file");
                    res.writeHead(201, { "Content-Type": "application/json" });
                    res.end(JSON.stringify(newMovie));
                });
            });
        });
    }
});

const port = 2500;
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});