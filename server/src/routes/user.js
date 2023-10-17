const express = require("express");
const {
  userById,
  getUserDetail,
  editUser,
  deleteUser,
  replacePassword,
  followCompany,
  getListUserForAdmin,
  saveWishlist,
  getWishlist,
  DeleteWishlist
} = require("../controllers/user");
const { jobById } = require("../controllers/job");

const router = express.Router();

router.get("/list-users/admin/:userId", getListUserForAdmin);
router.get("/get-user-detail/:userId", getUserDetail);
router.put("/edit-user/:userId", editUser);
router.delete("/delete-user/:userId", deleteUser);
router.put("/replace-password/:userId", replacePassword);
router.put("/follow-company/:userId", followCompany);
//lưu wishlist
router.post("/wishlist/save-job/:userId/:jobId", saveWishlist);
//get wishlist
router.get("/wishlist/get-list-job/:userId", getWishlist);
//xoá wishlist
router.delete("/wishlist/delete-job/:userId/:jobId", DeleteWishlist);

router.param("userId", userById);
router.param("jobId", jobById);

module.exports = router;
