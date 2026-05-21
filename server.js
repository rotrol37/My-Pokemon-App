const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

async function main() {
  app.set("view engine", "ejs");
  app.use(express.static("public"));

  app.get("/", (req, res) => {
    res.render("index", { name: "Pokemon Game" });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

main();
