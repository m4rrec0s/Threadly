import { Router } from "express";
import { PostController } from "./controllers/postController";
import {
  registerController,
  updateUserController,
  uploadAvatar,
} from "./controllers/registerController";
import loginController from "./controllers/loginController";
import uploadsConfig from "./config/multer";
import multer from "multer";
import { LikeController } from "./controllers/likeController";
import { CommentController } from "./controllers/commentController";
import { UserController } from "./controllers/userController";
import { FollowController } from "./controllers/followController";
import { AnswerController } from "./controllers/answerController";

export const router = Router();
const postController = new PostController();
const likeController = new LikeController();
const commentController = new CommentController();
const followController = new FollowController();
const answerController = new AnswerController();

const upload = multer(uploadsConfig);

router.get("/posts", postController.index);
router.get("/posts/:id", postController.getPostById);
router.get("/likes", likeController.index);
router.get("/comments", commentController.index);
router.get("/comments/post/:post_id", commentController.getByPostId);
const userController = new UserController();
router.get("/users", userController.index);
router.get("/followers/:user_id", followController.getFollowers);
router.get("/following/:user_id", followController.getFollowing);
router.get("/answers", answerController.index);

router.post("/posts", upload.array("images"), postController.store);
router.post("/register", uploadAvatar, registerController);
router.post("/login", loginController);
router.post("/likes", likeController.store);
router.post("/comments", commentController.store);
router.post("/follow", followController.follow);
router.post("/unfollow", followController.unfollow);
router.post("/answers", answerController.store);

router.put("/users/:id", uploadAvatar, updateUserController);
router.put("/answers/:id", answerController.update);

router.delete("/likes", likeController.deleteLike);
router.delete("/comments/:id", commentController.deleteComment);
router.delete("/posts/:id", postController.deletePost);
router.delete("/answers/:id", answerController.delete);
