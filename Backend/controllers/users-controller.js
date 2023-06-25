const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")

const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
    //await User.find({},'-password')
    //this method allows us to remove password from the objects returned by the database
    //we don't want to return password
  } catch (error) {
    return next(new HttpError("Cannot fetch users, please try again later"));
  }
  res
    .status(201)
    .json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { name, email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signing Up failed, please try again.", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User already exists, Please login instead.",
      422
    );
    return next(error);
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    const err = new HttpError("Could not create user, Please try again", 500);
    return next(err);
  }
  const createdUser = new User({
    name,
    email,
    image: req.file.path.replace("\\", "/"),
    password: hashedPassword,
    places: [],
  });
  let created;
  try {
    created = await createdUser.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Signing Up failed, please try again.", 500);
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (error) {
    return next(new HttpError("Signing Up failed, please try again.", 500));
  }
  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let identifiedUser;
  try {
    identifiedUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signing Up failed, please try again.", 500);
    return next(error);
  }

  if (!identifiedUser) {
    return next(
      new HttpError(
        "Could not identify user, Credentials seem to be wrong",
        403
      )
    );
  }
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, identifiedUser.password);
    //here we use decrypt library's bcrypt.compare to check that the hashed password could have been created
    //form the given password
  } catch (error) {
    const err = new HttpError(
      "Something on the Server side went wrong, please try again.",
      500
    );
    return next(err);
  }
  if (!isValidPassword) {
    return next(
      new HttpError("Invalid Credentials, could not log you in.", 403)
    );
  }
  let token;
  try {
    token = jwt.sign(
      { userId: identifiedUser.id, email: identifiedUser.email },
      "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (error) {
    return next(new HttpError("Logging in failed, please try again.", 500));
  }
  res.json({
    userId: identifiedUser.id,
    email: identifiedUser.email,
    token: token,
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
