const app = require("./app");
const dotenv = require("dotenv");
const path = require("path");

// Učitaj .env
dotenv.config({
    path: path.resolve(__dirname, ".env"),
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("");
    console.log("═══════════════════════════════════════════════════════");
    console.log("  🏗️  TeraBuild API");
    console.log("");
    console.log(`  🚀 Server radi na:  \x1b[36mhttp://localhost:${PORT}\x1b[0m`);
    console.log(`  📡 API na:          \x1b[36mhttp://localhost:${PORT}/api\x1b[0m`);
    console.log(`  🧪 Test:            \x1b[36mhttp://localhost:${PORT}/api/test\x1b[0m`);
    console.log("");
    console.log(`  ⏱️  Pokrenuto:       ${new Date().toLocaleString('hr-HR')}`);
    console.log(`  🌍 Okruženje:       ${process.env.NODE_ENV || 'development'}`);
    console.log("═══════════════════════════════════════════════════════");
    console.log("");
});