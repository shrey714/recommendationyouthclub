import express from "express";
import bodyParser from "body-parser";
import got from "got";
import Mongoose from "mongoose";
import chutiyashreya from "related-documents";
let Related = chutiyashreya.Related;
Mongoose.connect(
  "mongodb+srv://dev_jb_007:12345678devpatel@cluster0.ibx33.mongodb.net/YouthConclave?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => {
  console.log("Mongoose Connected");
});
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const apiKey = "acc_5682f9db5d3267e";
const apiSecret = "219e38a15a09f0e2cc0777e3fa40c429";

app.post("/get-obj", async (req, res) => {
  try {
    let imageUrl = req.body.imageUrl;
    let id = req.body.id;
    // const imageUrl = 'https://m.media-amazon.com/images/I/81iGzXUKpaL._SY675._SX._UX._SY._UY_.jpg';
    const url =
      "https://api.imagga.com/v2/tags?image_url=" +
      encodeURIComponent(imageUrl);
    const response = await got(url, { username: apiKey, password: apiSecret });
    let data = JSON.parse(response.body).result.tags;
    let content = "";
    for (let i = 0; i < data.length; i++) {
      content += data[i].tag.en + " ";
    }
    res.send({ id, data: content });
  } catch (error) {
    res.send(error);
  }
});
async function final(input_array) {
  let documents = input_array;
  const options = {
    serializer: (document) => [document.title, document.text],
    weights: [10, 1],
  };
  //   console.log(options);
  const related = new Related(documents, options);

  // Find documents related to document[0]
  return related.rank(documents[0]);
  console.log(related.rank(documents[0]));
  console.log(documents[0]);
}
app.post("/get-recommandation", async (req, res) => {
  try {
    console.log(req.body.array);
    let temp = await final(req.body.array);
    console.log(temp);
    res.send({ arr: temp });
  } catch (err) {
    res.send(err);
  }
});
const server = app.listen(process.env.PORT || 7777, () => {
  console.log(`Server running on http://localhost:7777`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
