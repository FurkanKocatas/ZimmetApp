const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5001;
const SECRET_KEY = "your_secret_key";

const users = [
    { username: "admin", password: bcrypt.hashSync("1234", 10) },
];
const zimmetler = [];

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Login endpoint
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
});

// Register endpoint
app.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Kullanıcı adı ve şifre gereklidir" });
    }

    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        return res.status(409).json({ message: "Kullanıcı adı zaten kullanılıyor" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    users.push({ username, password: hashedPassword });

    res.status(201).json({ message: "Kayıt başarılı!" });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
