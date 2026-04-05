const http = require("http");
const fs = require("fs");
const path = "movies.json";

// --- Read Movies Data ---
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

// --- Write Movies Data ---
function writeMovies(movies, callback) {
    fs.writeFile(path, JSON.stringify(movies, null, 2), (err) => {
        callback(err);
    });
}

// --- Get body from Request ---
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

// --- Build Node.js Server ---
const server = http.createServer((req, res) => {
    const urlParts = req.url.split("/");
    const id = urlParts[2] ? parseInt(urlParts[2]) : null;

    // --- GET /movies ---
    if (req.method === "GET" && req.url === "/movies") {
        readMovies((err, movies) => {
            if (err) return res.writeHead(500, { "Content-Type": "text/plain" }).end("Error reading file");
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(movies));
        });
    }

    // --- GET /movies/:id ---
    else if (req.method === "GET" && req.url.startsWith("/movies/")) {
        if (!id) return res.writeHead(400, { "Content-Type": "text/plain" }).end("Invalid ID");

        readMovies((err, movies) => {
            if (err) return res.writeHead(500, { "Content-Type": "text/plain" }).end("Error reading file");
            const movie = movies.find(m => m.id === id);
            if (!movie) return res.writeHead(404, { "Content-Type": "text/plain" }).end("Movie not found");
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(movie));
        });
    }

    // --- POST /movies ---
    else if (req.method === "POST" && req.url === "/movies") {
        getRequestBody(req, (err, newMovie) => {
            if (err) return res.writeHead(400, { "Content-Type": "text/plain" }).end("Invalid JSON");
            if (!newMovie.title) return res.writeHead(400, { "Content-Type": "text/plain" }).end("Title is required");
            if (newMovie.year !== undefined && typeof newMovie.year !== "number") return res.writeHead(400, { "Content-Type": "text/plain" }).end("Year must be a number");
            if (newMovie.rating !== undefined && typeof newMovie.rating !== "number") return res.writeHead(400, { "Content-Type": "text/plain" }).end("Rating must be a number");

            readMovies((err, movies) => {
                if (err) return res.writeHead(500, { "Content-Type": "text/plain" }).end("Error reading file");

                newMovie.id = movies.length ? movies[movies.length - 1].id + 1 : 1;
                movies.push(newMovie);

                writeMovies(movies, (err) => {
                    if (err) return res.writeHead(500, { "Content-Type": "text/plain" }).end("Error writing file");
                    res.writeHead(201, { "Content-Type": "application/json" });
                    res.end(JSON.stringify(newMovie));
                });
            });
        });
    }

    // --- PATCH /movies/:id ---
    else if (req.method === "PATCH" && req.url.startsWith("/movies/")) {
        if (!id) return res.writeHead(400, { "Content-Type": "text/plain" }).end("Invalid ID");

        getRequestBody(req, (err, updates) => {
            if (err) return res.writeHead(400, { "Content-Type": "text/plain" }).end("Invalid JSON");
            if (Object.keys(updates).length === 0) return res.writeHead(400, { "Content-Type": "text/plain" }).end("No data to update");
            if (updates.year !== undefined && typeof updates.year !== "number") return res.writeHead(400, { "Content-Type": "text/plain" }).end("Year must be a number");
            if (updates.rating !== undefined && typeof updates.rating !== "number") return res.writeHead(400, { "Content-Type": "text/plain" }).end("Rating must be a number");

            readMovies((err, movies) => {
                if (err) return res.writeHead(500, { "Content-Type": "text/plain" }).end("Error reading file");

                const index = movies.findIndex(m => m.id === id);
                if (index === -1) return res.writeHead(404, { "Content-Type": "text/plain" }).end("Movie not found");

                movies[index] = { ...movies[index], ...updates };

                writeMovies(movies, (err) => {
                    if (err) return res.writeHead(500, { "Content-Type": "text/plain" }).end("Error writing file");
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify(movies[index]));
                });
            });
        });
    }

    // --- DELETE /movies/:id ---
    else if (req.method === "DELETE" && req.url.startsWith("/movies/")) {
        if (!id) return res.writeHead(400, { "Content-Type": "text/plain" }).end("Invalid ID");

        readMovies((err, movies) => {
            if (err) return res.writeHead(500, { "Content-Type": "text/plain" }).end("Error reading file");

            const filteredMovies = movies.filter(m => m.id !== id);
            if (filteredMovies.length === movies.length) return res.writeHead(404, { "Content-Type": "text/plain" }).end("Movie not found");

            writeMovies(filteredMovies, (err) => {
                if (err) return res.writeHead(500, { "Content-Type": "text/plain" }).end("Error writing file");
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end("Movie deleted successfully");
            });
        });
    }

    // --- Route not found ---
    else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Route not found");
    }
});

// --- Start Server ---
const port = 2500;
server.listen(port, () => console.log(`Server is listening on port ${port}`));