import jsonServer from "json-server";
import registerController from "./controllers/registerController";
import loginController from "./controllers/loginController";
import { authMiddleware } from "./middlewares/authMiddlewares";

const databasePath = "api.json";
const port = 8080;

const server = jsonServer.create();
const router = jsonServer.router(databasePath);

server.use(
  jsonServer.defaults({
    bodyParser: true,
  })
);

server.post("/register", registerController);
server.post("/login", loginController);

// server.use(authMiddleware);

server.use(router);

server.listen(port, () => {
  console.log("Server running on port", port);
});
