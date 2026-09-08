const express = require("express");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

require("dotenv").config({
    path: path.resolve(__dirname, ".env"),
    quiet: true,
});

const app = express();

// ============================================================ //
// MIDDLEWARE
// ============================================================ //

// JSON parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS - dozvoli pristup s frontenda
app.use(
    cors({
        origin: (process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(",").map((x) => x.trim()) : [
            "http://localhost:9000",
            "http://localhost:5173",
            "http://localhost:8080",
        ]),
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// ============================================================ //
// STATIČKE DATOTEKE (ako imaš slike)
// ============================================================ //
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ============================================================ //
// RUTE
// ============================================================ //
const routes = require("./routes/index");
app.use("/api", routes);

// ============================================================ //
// TEST RUTA (zdravlje servera)
// ============================================================ //
app.get("/health", (req, res) => res.json({ success: true, status: "ok", timestamp: new Date().toISOString() }));

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "TeraBuild API radi!",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        endpoints: {
            api: "/api",
            test: "/api/test",
            proizvodi: "/api/proizvodi",
            kategorije: "/api/kategorije",
            narudzbe: "/api/narudzbe",
            auth: "/api/auth",
        },
    });
});

// ============================================================ //
// 404 - RUTA NIJE PRONAĐENA
// ============================================================ //
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Ruta nije pronađena",
        path: req.originalUrl,
        method: req.method,
    });
});

// ============================================================ //
// GLOBALNI HANDLER ZA GREŠKE
// ============================================================ //
app.use((err, req, res, next) => {
    console.error("Greška na serveru:", err.stack);

    // Multer greške
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            success: false,
            message: "Greška pri uploadu datoteke",
            error: err.message,
        });
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Interna greška servera",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
});

module.exports = app;