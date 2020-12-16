const express = require("express");
const Cloudant = require("@cloudant/cloudant");
const cors = require("cors");

const PORT = process.env.PORT || 3000;

const cloudant = new Cloudant({
  url:
    "https://4ae4b2d6-b74d-4002-9c3f-4f702bae7244-bluemix.cloudantnosqldb.appdomain.cloud",
  plugins: {
    iamauth: { iamApiKey: "cujz0ssLTiJZpr2SCO-1Swuom8Vb_8SvfFC2MeUCjH23" },
  },
});

const app = express();

const questionsBase = cloudant.db.use("questions");

app.use(cors({ origin: "*" }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.options("/api", function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.end();
});

app.use(express.json());

app.get("/api/questions", async (_, res) => {
  try {
    const response = await questionsBase.list();

    res.json(response);
  } catch (e) {
    console.log(e);
  }
});

app.get("/api/questions/:id", async (req, res) => {
  try {
    const response = await questionsBase.get(req.query.id);

    res.json(response);
  } catch (e) {
    console.log(e);
  }
});

app.put("/api/questions/:id", async (req, res) => {
  try {
    const { question } = req.body;

    const response = await questionsBase.insert(question);

    res.json(response);
  } catch (e) {
    console.log(e);
  }
});

app.post("/api/questions", async (req, res) => {
  try {
    const { question } = req.body;
    const response = await questionsBase.insert(question);

    res.json(response);
  } catch (e) {
    console.log(e);
  }
});

// app.put("/api/questions", async (req, res) => {
//   try {
//     const { product } = req.body;
//     const response = await questionsBase.insert(product);
//     res.json(response);
//   } catch (e) {
//     console.log(e);
//   }
// });

app.delete("/api/questions", async (req, res) => {
  try {
    const { id, revId } = req.query;

    const response = await questionsBase.destroy(id, revId);

    res.json({
      response: response,
    });
  } catch (e) {
    console.log(e);
  }
});

app.listen(PORT, () => console.log("server running"));
