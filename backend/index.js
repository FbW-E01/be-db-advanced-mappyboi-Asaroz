import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import requestlogger from "./middleware/requestlogger.js";
import Report from './models/report.js'
import mongoose from "mongoose"


let username = "Lars"
let pwd = "Lars123"

const connectionString = `mongodb://${username}:${pwd}@localhost:27017/test`




dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(requestlogger);

app.get("/notifications", (req, res) => {
  // Somehow load data from DB
  res.json([]);
});

app.post("/notifications", (req, res) => {
  console.log("Received", req.body);

  const report = new Report(req.body)

  mongoose
    .connect(connectionString)
    .then(async () => {
      console.log("saveing")
       await report.save()
          .then(() => {
          console.log("report saved!")
          res.status(201);
          res.json({
            success: true
          });
        })
        .catch((error) => {
          console.log(error)
        })
      console.log("connected")
    })
    .catch(e => console.log("Error while connecting", e))
    .finally(()=>{
      mongoose.connection.close()
    })






});

app.use((req, res) => {
  res.status(404);
  res.send("I don't have what you seek");
});

app.listen(process.env.PORT, () => {
  console.info(`App listening on http://localhost:${process.env.PORT}`);
});