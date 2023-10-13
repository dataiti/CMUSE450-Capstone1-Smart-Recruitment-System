const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const userById = asyncHandler(async (req, res, next, id) => {
  const isValidId = mongoose.Types.ObjectId.isValid(id);

  if (!isValidId) {
    return res.status(400).json({
      success: true,
      message: "User Id is invalid",
    });
  }

  const user = await User.findById(id).select("-password");

  if (!user) throw new Error("User is not find");

  req.user = user;
  next();
});

const getUserDetail = asyncHandler(async (req, res) => {
  const user = req.user;

  return res.status(200).json({
    success: true,
    message: "Get user detail is successfully",
    data: user,
  });
});

const editUser = asyncHandler(async (req, res) => {
  const { phoneNumber, firstName, lastName } = req.body;
  const avatar = req.file.path;

  const updateUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { phoneNumber, lastName, firstName, avatar },
    },
    { new: true }
  );

  return res.status(200).json({
    success: true,
    message: "Update user is successfully",
    data: updateUser,
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.user._id);

  return res.status(200).json({
    success: true,
    message: "Delete user is successfully",
  });
});

const replacePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword)
    throw new Error("All fields are required");

  if (newPassword !== confirmPassword)
    throw new Error("New password and confirm password are not match");

  const user = await User.findOne({ _id: req.user._id });

  if (!user.isCorrectPassword) throw new Error("Password is incorrect");

  user.password = newPassword;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Replace password is successfully",
    data: cleanUserMore(user),
  });
});

const followCompany = asyncHandler(async (req, res) => {});

const getListUserForAdmin = asyncHandler(async (req, res) => {
  const status = req.query.status ? req.query.status : "";
  const search = req.query.search ? req.query.search : "";
  const regex = search
    .split(" ")
    .filter((s) => s)
    .join("|");
  const sortBy = req.query.sortBy ? req.query.sortBy : "-_id";
  const orderBy =
    req.query.orderBy &&
    (req.query.orderBy == "asc" || req.query.orderBy == "desc")
      ? req.query.orderBy
      : "asc";
  const limit = req.query.limit ? Number(req.query.limit) : 8;
  const page =
    req.query.page && req.query.page > 0 ? Number(req.query.page) : 1;
  let skip = (page - 1) * limit;

  const filterArgs = {
    $or: [
      { firstName: { $regex: regex, $options: "i" } },
      { lastName: { $regex: regex, $options: "i" } },
      { email: { $regex: regex, $options: "i" } },
      { phoneNumber: { $regex: regex, $options: "i" } },
    ],
    permission: { $ne: "adminstractor" },
  };

  if (status) filterArgs.status = status;

  const countUser = await User.countDocuments(filterArgs);

  if (!countUser) throw new Error("List user is not find");

  const totalPage = Math.ceil(countUser / limit);

  if (page > totalPage) skip = (totalPage - 1) * limit;

  const listUsers = await User.find(filterArgs)
    .select("-password")
    .sort({ [sortBy]: orderBy, _id: -1 })
    .skip(skip)
    .limit(limit);

  return res.status(200).json({
    success: true,
    message: "Get list of users are successfully",
    currentPage: page,
    totalPage,
    countUser,
    data: listUsers,
  });
});

module.exports = {
  userById,
  getUserDetail,
  editUser,
  deleteUser,
  replacePassword,
  followCompany,
  getListUserForAdmin,
};