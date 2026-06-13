import express from "express";

const router = express.Router();

router.get("/ping", (req, res) => {
  res.status(200).send({
    success: true,
    message: "pong",
    time: new Date().toISOString(),
  });
});

export default router;
