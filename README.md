# 🎬 Movies App by JS

## 🚀 How to Run the Server

1. Make sure you have **Node.js** installed.
2. Open the terminal and navigate to the project folder.
3. Run the server:

```bash
node index.js
```

4. The server will run on:

```
http://localhost:2500
```

5. You can test the API using **Postman**.

---

## 🛣 Endpoints

### 🎞️ Get All Movies

**GET** `/movies`
Returns a list of all movies.

---

### 🔍 Get Movie by ID

**GET** `/movies/:id`
Returns a single movie by its ID.

---

### ➕ Add New Movie

**POST** `/movies`
Creates a new movie.

---

### ✏️ Update Movie

**PATCH** `/movies/:id`
Updates an existing movie.

---

### ❌ Delete Movie

**DELETE** `/movies/:id`
Deletes a movie by ID.

---

## 📝 Example Request Body

### ➕ POST /movies

```json
{
  "title": "Inception",
  "year": 2010,
  "rating": 8.8
}
```

### ✏️ PATCH /movies/:id

```json
{
  "rating": 9.0
}
```

---

## 💡 Assumptions

* Movie ID is generated automatically.
* If rating is not provided, it is left undefined.
* Only basic validation is applied (type checking).

---

## ⚠️ Known Limitations

* No advanced validation (only basic checks).
* No search or filtering implemented.
* Data is stored in a JSON file instead of a database.

---

## ✅ Progress

* Implemented all required endpoints (GET, POST, PATCH, DELETE).
* Handled file read/write using Node.js.
* Added validation and error handling.
* Used proper HTTP status codes.

---

## 😅 Challenges

* Handling JSON file updates without a database.
* Managing request body parsing manually.
* Keeping code organized without using frameworks like Express.
