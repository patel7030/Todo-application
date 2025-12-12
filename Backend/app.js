// server.js (Railway-ready; prefers DATABASE_URL)
import mysql from "mysql2/promise";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(new Date().toISOString(), req.method, req.originalUrl);
    next();
});

let pool;

async function initDB() {
    const dbUrl = (process.env.DATABASE_URL || process.env.MYSQL_PUBLIC_URL || "").trim();

    if (dbUrl && !dbUrl.startsWith("${{")) {
        console.log("Using DB connection string from env.");
        pool = mysql.createPool(dbUrl + (dbUrl.includes("?") ? "&" : "?") + "connectionLimit=10");
    } else {
        // fallback to local values
        const host = process.env.MYSQLHOST;
        const user = process.env.MYSQLUSER;
        const password = process.env.MYSQLPASSWORD;
        const database = process.env.MYSQL_DATABASE;
        const port = process.env.MYSQLPORT ? Number(process.env.MYSQLPORT) : 3306;

        console.log("Using individual MYSQL* env vars / local defaults.");
        pool = mysql.createPool({
            host,
            user,
            password,
            database,
            port,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    // quick test
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log("✅ MySQL pool initialized");
}

async function query(sql, params = []) {
    const [rows] = await pool.query(sql, params);
    return rows;
}

(async() => {
    try {
        await initDB();
    } catch (err) {
        console.error("DB init failed:", err.message || err);
        process.exit(1);
    }

    app.get("/", (req, res) => res.send("Server running"));

    app.get("/todos", async(req, res) => {
        try {
            const user_id = req.query.user_id;
            if (!user_id) return res.status(400).json({ error: "user_id is required" });

            const filter = req.query.status;
            let sql = "SELECT * FROM todos WHERE user_id = ? AND status != 'deleted'";
            const params = [user_id];
            if (filter) {
                sql += " AND status = ?";
                params.push(filter);
            }

            const rows = await query(sql, params);
            res.json(rows);
        } catch (err) {
            console.error("GET /todos error:", err);
            res.status(500).json({ error: "Server error" });
        }
    });

    app.post("/todos", async(req, res) => {
        try {
            const { task, user_id } = req.body;
            if (!user_id) return res.status(400).json({ error: "user_id is required" });
            if (!task) return res.status(400).json({ error: "task is required" });

            await query("INSERT INTO todos (task, status, user_id) VALUES (?, 'active', ?)", [task, String(user_id)]);
            res.json({ message: "Todo added!" });
        } catch (err) {
            console.error("POST /todos error:", err);
            res.status(500).json({ error: "Insert failed" });
        }
    });

    app.put("/todos/:id", async(req, res) => {
        try {
            const { id } = req.params;
            const { status, task } = req.body;
            if (!status && !task) return res.status(400).json({ error: "nothing to update" });

            if (status) await query("UPDATE todos SET status = ? WHERE id = ?", [status, id]);
            if (task) await query("UPDATE todos SET task = ? WHERE id = ?", [task, id]);

            res.json({ message: "Todo updated!" });
        } catch (err) {
            console.error("PUT /todos error:", err);
            res.status(500).json({ error: "Update failed" });
        }
    });

    // Hard delete — permanently remove row
    app.delete("/todos/:id", async(req, res) => {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ error: "id is required" });

            await query("DELETE FROM todos WHERE id = ?", [id]);

            res.json({ message: "Todo permanently deleted!" });
        } catch (err) {
            console.error("DELETE /todos/:id error:", err);
            res.status(500).json({ error: "Delete failed" });
        }
    });



    const PORT = process.env.PORT || 5000;
    app.listen(PORT, "0.0.0.0", () => console.log(`Server listening on ${PORT}`));
})();