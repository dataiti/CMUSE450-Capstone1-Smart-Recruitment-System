const ApplyJob = require("../models/applyJob");
const Job = require("../models/job");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const nlp = require("compromise");
const natural = require("natural");
const tokenizer = new natural.WordTokenizer();
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} = require("firebase/storage");
const firebaseConfig = require("../configs/firebaseConfig");
const pdf = require("pdf-parse");
const { MODEL_NAME, client } = require("../configs/googleAIConfig");

const applyJobById = asyncHandler(async (req, res, next, id) => {
  const isValidId = mongoose.Types.ObjectId.isValid(id);

  if (!isValidId) {
    return res.status(400).json({
      success: true,
      message: "Application Id is invalid",
    });
  }

  const applyJob = await ApplyJob.findById(id)
    .populate("candidateId", "firstName lastName email avatar")
    .populate("jobId")
    .populate(
      "employerId",
      "companyLogo companyName companyEmail companyPhoneNumber"
    );

  if (!applyJob)
    return res.status(400).json({
      success: true,
      message: "Apply job is not find",
    });

  req.applyJob = applyJob;
  next();
});

const getApplyJobDetail = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Get apply job detail is successfully",
    data: req.applyJob,
  });
});

const applyJob = asyncHandler(async (req, res) => {
  // const data = await pdf(req.file.buffer);
  // const cvText = data.text;

  // // const tokenizer = new natural.WordTokenizer();
  // // const tokens = cvText.split("\n").filter((word) => word.trim() !== "");

  // const result = await client.generateText({
  //   model: MODEL_NAME,
  //   prompt: {
  //     text: `${cvText}. Please generate json format for contact, number of work year experience, skills as an array, education`,
  //   },
  // });

  // console.log(JSON.parse(result[0]?.candidates[0]?.output));

  // const cleanedJsonString = result[0]?.candidates[0]?.output.replace(
  //   /\\n|\\t/g,
  //   ""
  // );

  // const jsonData = JSON.parse(cleanedJsonString);

  // console.log(jsonData);

  // console.log(tokens);
  const storage = getStorage();
  const storageRef = ref(storage, `pdf-files/${req.file.originalname}`);

  try {
    const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, {
      contentType: req.file.mimetype,
    });

    const downloadURL = await getDownloadURL(snapshot.ref);

    const newApplyJob = new ApplyJob({
      candidateId: req.user._id,
      jobId: req.job._id,
      employerId: req.employer._id,
      CVName: req.file.originalname,
      CVpdf: downloadURL,
      information: req.body.information,
    });

    const savedApplyJob = await newApplyJob.save();

    await Job.findOneAndUpdate(
      { _id: req.job._id },
      {
        $set: {
          appliedIds: [...req.job.appliedIds, savedApplyJob._id],
        },
      },
      { new: true }
    );

    await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $set: {
          appliedJobs: [...req.user.appliedJobs, req.job._id],
        },
      },
      { new: true }
    );
  } catch (error) {
    await deleteObject(storageRef);

    return res.status(500).json({
      success: false,
      message: "Error uploading file and adding ApplyJob",
    });
  }
});

const updateApplyJob = asyncHandler(async (req, res) => {});

const deleteApplyJob = asyncHandler(async (req, res) => {});

const stopApplyJob = asyncHandler(async (req, res) => {});

const responseEmployerForApplyJob = asyncHandler(async (req, res) => {
  const { response } = req.body;

  if (!response) throw new Error("Response field is required");

  const updateApplyJob = await ApplyJob.findOneAndUpdate(
    { _id: req.applyJob._id },
    { $set: { response } },
    { new: true }
  );

  if (!updateApplyJob) throw new Error("Response employer is fail");

  return res.status(200).json({
    success: true,
    message: "Response employer is successfully",
    data: updateApplyJob,
  });
});

const getListApplyJobForEmployer = asyncHandler(async (req, res) => {
  const { query } = req;
  const search = query.search ? query.search : "";
  const status = query.status ? query.status : "";
  const regex = search
    .split(" ")
    .filter((q) => q)
    .join("|");
  const limit = query.limit > 0 ? Number(query.limit) : 6;
  const page = query.page > 0 ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const filterArgs = {
    $or: [{ CVName: { $regex: regex, $options: "i" } }],
    employerId: req.employer._id,
    // status: status,
  };

  const countApplyJobs = await ApplyJob.countDocuments(filterArgs);

  const totalPage = Math.ceil(countApplyJobs / limit);

  const listApplyJobs = await ApplyJob.find(filterArgs)
    .sort("-_id")
    .skip(skip)
    .limit(limit)
    .populate("candidateId", "firstName lastName email avatar")
    .populate("jobId")
    .populate(
      "employerId",
      "companyLogo companyName companyEmail companyPhoneNumber"
    );

  return res.status(200).json({
    success: true,
    message: "Get list apply jobs are successfully",
    totalPage,
    count: countApplyJobs,
    data: listApplyJobs,
  });
});

const getListApplyJobForCandidate = asyncHandler(async (req, res) => {
  const { query } = req;
  const search = query.search ? query.search : "";
  const status = query.status ? query.status : "";
  const regex = search
    .split(" ")
    .filter((q) => q)
    .join("|");
  const limit = query.limit > 0 ? Number(query.limit) : 6;
  const page = query.page > 0 ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const filterArgs = {
    $or: [{ CVName: { $regex: regex, $options: "i" } }],
    candidateId: req.user._id,
    // status: status,
  };

  const countApplyJobs = await ApplyJob.countDocuments(filterArgs);

  const totalPage = Math.ceil(countApplyJobs / limit);

  const listApplyJobs = await ApplyJob.find(filterArgs)
    .sort("-_id")
    .skip(skip)
    .limit(limit)
    .populate("candidateId", "firstName lastName email avatar")
    .populate("jobId")
    .populate(
      "employerId",
      "companyLogo companyName companyEmail companyPhoneNumber"
    );

  return res.status(200).json({
    success: true,
    message: "Get list apply jobs for candidate are successfully",
    totalPage,
    count: countApplyJobs,
    data: listApplyJobs,
  });
});

module.exports = {
  applyJobById,
  getApplyJobDetail,
  applyJob,
  updateApplyJob,
  deleteApplyJob,
  stopApplyJob,
  responseEmployerForApplyJob,
  getListApplyJobForEmployer,
  getListApplyJobForCandidate,
};
