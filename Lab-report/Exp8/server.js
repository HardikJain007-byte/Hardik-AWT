const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/shopDB")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Schema
const itemSchema = new mongoose.Schema({
    name: String,
    price: Number,
    quantity: Number
});

const Item = mongoose.model("Item", itemSchema);

// Serve UI
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "item.html"));
});

// Add Item
app.post("/items/add", async (req, res) => {
    let item = new Item(req.body);
    await item.save();
    res.json({ success: true });
});

// Get All Items (Stock Report)
app.get("/items", async (req, res) => {
    let items = await Item.find();
    res.json(items);
});

// Delete Item
app.delete("/items/delete/:id", async (req, res) => {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

// Update Item
app.put("/items/update/:id", async (req, res) => {
    await Item.findByIdAndUpdate(req.params.id, req.body);
    res.json({ success: true });
});

// Sale (reduce quantity)
app.put("/items/sale/:id", async (req, res) => {
    let item = await Item.findById(req.params.id);
    if (!item) return res.json({ success: false });

    let qty = Number(req.body.quantity);
    if (item.quantity < qty)
        return res.json({ success: false, msg: "Not enough stock" });

    item.quantity -= qty;
    await item.save();

    res.json({ success: true });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));