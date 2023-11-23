const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect(
  "mongodb+srv://sithuhtet016:J4Kl4d519KZ35P6Y@cluster0.bxjwawz.mongodb.net/todoListDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const newListItemSchema = new mongoose.Schema({
  name: String,
});

const ListItems = mongoose.model("ListItems", newListItemSchema);

const today = new Date();
const options = { weekday: "long", month: "short", day: "numeric" };
const formattedDate = today.toLocaleDateString("en-US", options);

app.get("/", async (req, res) => {
  try {
    const ListItemsArr = await ListItems.find({});
    res.render("list", { ListTitle: formattedDate, MyList: ListItemsArr });
  } catch (err) {
    console.error(err);
    res.render("list", {
      ListTitle: formattedDate,
      MyList: [],
    });
  }
});

app.post("/delete", async (req, res) => {
  const checkedItemId = req.body.checkbox;
  try {
    const deletedItem = await ListItems.findByIdAndDelete(checkedItemId);
    if (deletedItem) {
      console.log("Deleted User:", deletedItem);
    } else {
      console.log("Item not found");
    }
  } catch (err) {
    console.error(err);
  }
  res.redirect("/");
});

app.post("/", async (req, res) => {
  const listItem = new ListItems({
    name: req.body.inputList,
  });
  await listItem.save();
  res.redirect("/");
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}.`);
});
