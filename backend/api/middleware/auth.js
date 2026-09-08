const jwt = require("jsonwebtoken");

// ============================================================ //
// AUTHENTICATE – Provjera je li korisnik prijavljen
// ============================================================ //
exports.authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Niste prijavljeni. Molimo prijavite se.",
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Niste prijavljeni. Molimo prijavite se.",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "tajni_kljuc");
        req.userId = decoded.id;
        req.userTip = decoded.tip;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Sesija je istekla. Molimo ponovno se prijavite.",
        });
    }
};

// ============================================================ //
// IS ADMIN – Provjera ima li korisnik admin prava
// ============================================================ //
exports.isAdmin = async (req, res, next) => {
    if (req.userTip !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Nemate administratorska prava za ovu radnju.",
        });
    }
    next();
};