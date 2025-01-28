import express from "express";
import { router } from "./routes";
import path from "path";
import cors from "cors";

const app = express();
const port = 8080;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(router);

app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
