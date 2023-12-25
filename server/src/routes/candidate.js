const express = require("express");
const {
  candidateById,
  getCandidateDetail,
  registerCandidate,
  editCandidate,
  deleteCandidate,
  suggestedCandidates,
} = require("../controllers/candidate");
const { userById } = require("../controllers/user");
const { uploadMemo } = require("../configs/cloudinaryConfig");
const { employerById } = require("../controllers/employer");

const router = express.Router();

router.get(
  "/get-suggested-candidates/:userId/:employerId",
  suggestedCandidates
);
router.get("/get-user-detail/:userId/:candidateId", getCandidateDetail);
router.post(
  "/register-candidate/:userId",
  uploadMemo.single("CVpdf"),
  registerCandidate
);
router.put("/edit-candidate/:userId/:candidateId", editCandidate);
router.delete("/delete-candidate/:userId/:candidateId", deleteCandidate);

router.param("userId", userById);
router.param("candidateId", candidateById);
router.param("employerId", employerById);

module.exports = router;
