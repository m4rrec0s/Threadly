import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(__dirname, "..", "..", "uploads", "avatar"),
    filename(request, file, callback) {
      const now = new Date().toISOString().replace(/[:.]/g, "-");
      callback(
        null,
        `${file.fieldname}-${now}${path.extname(file.originalname)}`
      );
    },
  }),
  limits: {
    fileSize: 8 * 1024 * 1024, // 8MB
  },
  fileFilter: (request, file, callback) => {
    const mimeType = ["image/jpeg", "image/png", "image/jpg", "image/gif"];

    if (!mimeType.includes(file.mimetype)) {
      callback(null, false);
    }
    callback(null, true);
  },
});

export const registerController = async (req: Request, res: Response) => {
  const { name, email, username, password } = req.body;
  const image = req.file;

  if (!name || !email || !password || !username) {
    return res.status(400).json({
      message: "name, email, username, and password are required.",
    });
  }

  const emailExists = await prisma.user.findUnique({ where: { email } });
  const usernameExists = await prisma.user.findUnique({ where: { username } });

  if (emailExists) {
    return res.status(400).json({
      message: "email already exists.",
    });
  }

  if (usernameExists) {
    return res.status(400).json({
      message: "username already exists.",
    });
  }

  const hashPassword = await bcrypt.hash(String(password), 8);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
      username,
      image: image ? image.filename : "",
    },
  });

  return res.status(201).json(newUser);
};

export const updateUserController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, username, password } = req.body;
  const image = req.file;

  const user = await prisma.user.findUnique({ where: { id: id } });

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  const hashPassword = password
    ? await bcrypt.hash(String(password), 8)
    : user.password;

  if (image && user.image) {
    const oldImagePath = path.join(
      __dirname,
      "..",
      "..",
      "uploads",
      "avatar",
      user.image
    );
    fs.unlink(oldImagePath, (err) => {
      if (err) {
        console.error("Failed to delete old image:", err);
      }
    });
  }

  const updatedUser = await prisma.user.update({
    where: { id: id },
    data: {
      name: name || user.name,
      email: email || user.email,
      username: username || user.username,
      password: hashPassword,
      image: image ? image.filename : user.image,
    },
  });

  return res.status(200).json(updatedUser);
};

export const uploadAvatar = upload.single("image");
