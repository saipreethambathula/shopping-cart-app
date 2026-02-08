const express = require("express");
const cors = require("cors");
require("./db/database"); // Initialize DB

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/users", require("./routes/users"));
app.use("/items", require("./routes/items"));
app.use("/carts", require("./routes/carts"));
app.use("/orders", require("./routes/orders"));

// Dynamic PORT for Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
