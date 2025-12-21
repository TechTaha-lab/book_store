require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  },
});

const upload = multer({ storage });

app.get("/", (req, res) => {
  res.send("Online Bookstore API is running ✅");
});

app.get("/api/books", (req, res) => {
  const sql = "SELECT * FROM books";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

app.get("/api/books/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM books WHERE book_id = ?";
  db.query(sql, [id], (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (rows.length === 0) return res.status(404).json({ error: "Book not found" });
    res.json(rows[0]);
  });
});

app.post("/api/books", upload.single("image"), (req, res) => {
  const { title, author, description, price, category } = req.body;

  if (!title || !author || !price)
    return res.status(400).json({ error: "Title, author and price are required" });

  const imageUrl = req.file
    ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    : "";

  const sql =
    "INSERT INTO books (title, author, description, price, category, image_url) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(
    sql,
    [title, author, description || "", price, category || "", imageUrl],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.status(201).json({
        message: "Book created successfully",
        book_id: result.insertId,
        image_url: imageUrl,
      });
    }
  );
});

app.put("/api/books/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  const { title, author, description, price, category, image_url } = req.body;

  if (!title || !author || !price)
    return res.status(400).json({ error: "Title, author and price are required" });

  const newImageUrl = req.file
    ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    : image_url || "";

  const sql =
    "UPDATE books SET title = ?, author = ?, description = ?, price = ?, category = ?, image_url = ? WHERE book_id = ?";
  db.query(
    sql,
    [title, author, description || "", price, category || "", newImageUrl, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (result.affectedRows === 0)
        return res.status(404).json({ error: "Book not found" });
      res.json({ message: "Book updated successfully", image_url: newImageUrl });
    }
  );
});

app.delete("/api/books/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM books WHERE book_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Book not found" });
    res.json({ message: "Book deleted successfully" });
  });
});

app.post("/api/register", async (req, res) => {
  const { username, email, password, user_role } = req.body;

  if (!username || !email || !password)
    return res
      .status(400)
      .json({ error: "Username, email and password are required" });

  const checkSql = "SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1";
  db.query(checkSql, [email, username], async (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (rows.length > 0)
      return res.status(400).json({ error: "Email or username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const sql =
      "INSERT INTO users (username, email, password, user_role) VALUES (?, ?, ?, ?)";
    const role = typeof user_role === "number" ? user_role : 0;

    db.query(sql, [username, email, hashedPassword, role], (err2, result) => {
      if (err2) return res.status(500).json({ error: "Failed to create user" });

      res.status(201).json({
        message: "User registered successfully",
        user: {
          user_id: result.insertId,
          username,
          email,
          user_role: role,
        },
      });
    });
  });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  const sql = "SELECT * FROM users WHERE email = ? LIMIT 1";
  db.query(sql, [email], async (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (rows.length === 0)
      return res.status(401).json({ error: "Invalid email or password" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(401).json({ error: "Invalid email or password" });

    res.json({
      message: "Login successful",
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        user_role: user.user_role,
      },
    });
  });
});

app.get("/api/users", (req, res) => {
  const sql = "SELECT user_id, username, email, user_role, created_at FROM users";
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(rows);
  });
});

app.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const { username, email, user_role } = req.body;

  if (!username || !email)
    return res.status(400).json({ error: "Username and email are required" });

  const sql =
    "UPDATE users SET username = ?, email = ?, user_role = ? WHERE user_id = ?";
  db.query(sql, [username, email, user_role ?? 0, id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "User not found" });

    res.json({ message: "User updated successfully" });
  });
});

app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM users WHERE user_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "User not found" });

    res.json({ message: "User deleted successfully" });
  });
});

app.post("/api/orders", (req, res) => {
  const { user_id, total_amount, order_status, items } = req.body;

  if (!user_id || !total_amount || !items || items.length === 0) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const orderSql =
    "INSERT INTO orders (user_id, total_amount, order_status) VALUES (?, ?, ?)";

  db.query(orderSql, [user_id, total_amount, order_status || "Pending"], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error when creating order" });

    const orderId = result.insertId;

    const itemSql =
      "INSERT INTO order_items (order_id, book_id, quantity, price) VALUES ?";

    const itemsData = items.map((it) => [
      orderId,
      it.book_id,
      it.quantity,
      it.price,
    ]);

    db.query(itemSql, [itemsData], (err2) => {
      if (err2)
        return res.status(500).json({ error: "Database error when creating items" });

      res.status(201).json({
        message: "Order created successfully",
        order_id: orderId,
      });
    });
  });
});
app.get("/api/orders", (req, res) => {
  const sql = `
    SELECT o.*, u.username 
    FROM orders o
    JOIN users u ON o.user_id = u.user_id
    ORDER BY o.order_id DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });

    res.json(rows);
  });
});
app.get("/api/orders/:id", (req, res) => {
  const { id } = req.params;

  const orderSql = "SELECT * FROM orders WHERE order_id = ?";
  const itemsSql = `
    SELECT oi.*, b.title 
    FROM order_items oi
    JOIN books b ON oi.book_id = b.book_id
    WHERE oi.order_id = ?
  `;

  db.query(orderSql, [id], (err, orderRows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (orderRows.length === 0) return res.status(404).json({ error: "Order not found" });

    db.query(itemsSql, [id], (err2, itemsRows) => {
      if (err2) return res.status(500).json({ error: "Database error" });

      res.json({
        ...orderRows[0],
        items: itemsRows,
      });
    });
  });
});
app.put("/api/orders/:id", (req, res) => {
  const { id } = req.params;
  const { order_status } = req.body;

  if (!order_status)
    return res.status(400).json({ error: "Order status is required" });

  const sql = "UPDATE orders SET order_status = ? WHERE order_id = ?";

  db.query(sql, [order_status, id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Order not found" });

    res.json({ message: "Order updated successfully" });
  });
});
app.delete("/api/orders/:id", (req, res) => {
  const { id } = req.params;

  const deleteItems = "DELETE FROM order_items WHERE order_id = ?";
  const deleteOrder = "DELETE FROM orders WHERE order_id = ?";

  db.query(deleteItems, [id], (err) => {
    if (err) return res.status(500).json({ error: "Failed delete items" });

    db.query(deleteOrder, [id], (err2, result2) => {
      if (err2) return res.status(500).json({ error: "Failed delete order" });

      if (result2.affectedRows === 0)
        return res.status(404).json({ error: "Order not found" });

      res.json({ message: "Order deleted successfully" });
    });
  });
});
// Add to cart
app.post("/api/cart", (req, res) => {
  const { user_id, book_id, quantity } = req.body;

  if (!user_id || !book_id) {
    return res
      .status(400)
      .json({ error: "user_id and book_id are required" });
  }

  const qty = quantity && quantity > 0 ? quantity : 1;

  const checkSql = "SELECT * FROM cart WHERE user_id = ? AND book_id = ?";

  db.query(checkSql, [user_id, book_id], (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (rows.length > 0) {
      const existing = rows[0];
      const newQuantity = existing.quantity + qty;

      const updateSql =
        "UPDATE cart SET quantity = ? WHERE cart_id = ?";

      db.query(updateSql, [newQuantity, existing.cart_id], (err2) => {
        if (err2)
          return res.status(500).json({ error: "Database error on update" });

        return res.json({
          message: "Cart updated successfully",
          cart_id: existing.cart_id,
          quantity: newQuantity,
        });
      });
    } else {
      const insertSql =
        "INSERT INTO cart (user_id, book_id, quantity) VALUES (?, ?, ?)";

      db.query(insertSql, [user_id, book_id, qty], (err3, result) => {
        if (err3)
          return res.status(500).json({ error: "Database error on insert" });

        return res.status(201).json({
          message: "Item added to cart",
          cart_id: result.insertId,
          quantity: qty,
        });
      });
    }
  });
});

app.get("/api/cart/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT 
      c.cart_id,
      c.user_id,
      c.book_id,
      c.quantity,
      c.added_at,
      b.title,
      b.price,
      b.image_url
    FROM cart c
    JOIN books b ON c.book_id = b.book_id
    WHERE c.user_id = ?
    ORDER BY c.added_at DESC
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(rows);
  });
});

app.delete("/api/cart/:user_id/:book_id", (req, res) => {
  const { user_id, book_id } = req.params;

  const sql = "DELETE FROM cart WHERE user_id = ? AND book_id = ?";

  db.query(sql, [user_id, book_id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    res.json({ message: "Item removed from cart successfully" });
  });
});

app.post("/api/checkout", (req, res) => {
  const { user_id, items, payment_method } = req.body;

  if (!user_id || !items || items.length === 0) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const total_amount = items.reduce(
    (sum, it) => sum + Number(it.price) * Number(it.quantity),
    0
  );

  const createOrderSql =
    "INSERT INTO orders (user_id, total_amount, order_status) VALUES (?, ?, ?)";

  db.query(
    createOrderSql,
    [user_id, total_amount, "Pending"],
    (err, orderResult) => {
      if (err) return res.status(500).json({ error: "Database error (order)" });

      const order_id = orderResult.insertId;

      const orderItemsSql =
        "INSERT INTO order_items (order_id, book_id, quantity, price) VALUES ?";

      const itemsData = items.map((it) => [
        order_id,
        it.book_id,
        it.quantity,
        it.price,
      ]);

      db.query(orderItemsSql, [itemsData], (err2) => {
        if (err2)
          return res.status(500).json({ error: "Database error (items)" });

        const paymentSql =
          "INSERT INTO payments (order_id, user_id, amount, payment_method, payment_status) VALUES (?, ?, ?, ?, ?)";

        db.query(
          paymentSql,
          [order_id, user_id, total_amount, payment_method, "Completed"],
          (err3, paymentResult) => {
            if (err3)
              return res.status(500).json({ error: "Database error (payment)" });

            const clearCartSql = "DELETE FROM cart WHERE user_id = ?";

            db.query(clearCartSql, [user_id], (err4) => {
              if (err4)
                return res
                  .status(500)
                  .json({ error: "Database error (clear cart)" });

              return res.status(201).json({
                message: "Order, payment created and cart cleared successfully",
                order_id,
                payment_id: paymentResult.insertId,
                total_amount,
              });
            });
          }
        );
      });
    }
  );
});
app.post("/api/contact", (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql =
    "INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)";

  db.query(sql, [name, email, subject, message], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to save message" });

    res.status(201).json({
      message: "Message submitted successfully",
      message_id: result.insertId,
    });
  });
});

app.get("/api/users/:id", (req, res) => {
  const { id } = req.params;

  const sql =
    "SELECT user_id, username, email, user_role, created_at FROM users WHERE user_id = ?";

  db.query(sql, [id], (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(rows[0]);
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
