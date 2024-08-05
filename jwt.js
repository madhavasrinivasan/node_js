const express = require('express'); // Corrected require statement
const jwt = require('jsonwebtoken'); // Corrected require statement

const createtoken = (user) => {
  const accesstoken = jwt.sign({ username: user.username, id: user.id }, "maddy");
  return accesstoken; // Corrected return statement placement
};

const validatetoken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).send({ message: "Please login first" });

  try {
    const verifytoken = jwt.verify(token, "maddy"); // Corrected jwt.verify method usage
    if (verifytoken) {
      req.user = verifytoken; // Set the decoded token (verifytoken) to req.user
      next();
    }
  } catch (err) {
    console.log(err);
    res.status(400).json("Access denied");
  }
};

module.exports = { createtoken, validatetoken };
