const express = require("express");
const {
  recommentCVForEmployer,
  recommentJobForCandidate,
} = require("../controllers/recommender");
const { userById } = require("../controllers/user");
const { candidateById } = require("../controllers/candidate");
const { jobById } = require("../controllers/job");

const router = express.Router();

router.get("/create-address", recommentCVForEmployer);
router.get("/recomment-jobs/:userId", recommentJobForCandidate);

router.param("userId", userById);
router.param("candidateId", candidateById);
router.param("jobId", jobById);

module.exports = router;
