const Job = require("../models/job");
const Address = require("../models/address");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const job = require("../models/job");
const { parseArrayQueryParam } = require("../utils/fn");

const jobById = asyncHandler(async (req, res, next, id) => {
  const isValidId = mongoose.Types.ObjectId.isValid(id);

  if (!isValidId) {
    return res.status(400).json({
      success: true,
      message: "Job Id is invalid",
    });
  }

  const job = await Job.findById(id).populate('employerId').populate("workRegion");

  if (!job) throw new Error("Job is not find");

  req.job = job;
  next();
});

const getJobDetail = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Get job detail is successfully",
    data: req.job,
  });
});

const createJob = asyncHandler(async (req, res) => {
  const applicationDeadline = new Date(req.body.applicationDeadline);

  const newAddress = new Address({
    province: req.body.province,
    ward: req.body.ward,
    district: req.body.district,
    exactAddress: req.body.exactAddress,
  });

  await newAddress.save();

  if (!newAddress) throw new Error("Create job is fail");

  const newJob = new Job({
    employerId: req.employer._id,
    // categoryId: req.category.categoryId,
    recruitmentCampaignName: req.body.recruitmentCampaignName,
    jobPosition: req.body.jobPosition,
    workRegion: newAddress._id,
    recruitmentTitle: req.body.recruitmentTitle,
    industry: req.body.industry,
    vacancyCount: Number(req.body.vacancyCount),
    jobType: req.body.jobType,
    gender: req.body.gender,
    level: req.body.level,
    experience: req.body.experience,
    currencyType: req.body.currencyType,
    salaryType: req.body.salaryType,
    salaryFrom: req.body.salaryFrom && Number(req.body.salaryFrom),
    salaryTo: req.body.salaryTo && Number(req.body.salaryTo),
    jobDescription: req.body.jobDescription,
    candidateRequirements: req.body.candidateRequirements,
    skills: JSON.parse(req.body.skills),
    candidateBenefits: req.body.candidateBenefits,
    applicationDeadline: applicationDeadline,
    receiverFullName: req.body.receiverFullName,
    receiverEmail: req.body.receiverEmail,
    receiverPhone: req.body.receiverPhone,
  });

  await newJob.save();

  if (!newJob) throw new Error("Create job is fail");

  const findJob = await Job.findOne({ _id: newJob._id }).populate("workRegion");

  return res.status(200).json({
    success: true,
    message: "Create job is successfully",
    data: findJob,
  });
});

const editJob = asyncHandler(async (req, res) => {
  const updateAddressInterview = await Address.findOneAndUpdate(
    {
      _id: req.address._id,
    },
    {
      $set: {
        province: req.body.province,
        ward: req.body.ward,
        district: req.body.district,
        exactAddress: req.body.exactAddress,
      },
    },
    { new: true }
  );

  if (!updateAddressInterview) throw new Error("Update address is fail");

  const updateJob = await Job.findOneAndUpdate(
    { _id: req.job._id },
    {
      $set: {
        recruitmentCampaignName: req.body.recruitmentCampaignName,
        jobPosition: req.body.jobPosition,
        recruitmentTitle: req.body.recruitmentTitle,
        industry: req.body.industry,
        vacancyCount: Number(req.body.vacancyCount),
        jobType: req.body.jobType,
        gender: req.body.gender,
        level: req.body.level,
        experience: req.body.experience,
        currencyType: req.body.currencyType,
        salaryType: req.body.salaryType,
        salaryFrom: req.body.salaryFrom && Number(req.body.salaryFrom),
        salaryTo: req.body.salaryTo && Number(req.body.salaryTo),
        jobDescription: req.body.jobDescription,
        candidateRequirements: req.body.candidateRequirements,
        candidateBenefits: req.body.candidateBenefits,
        applicationDeadline: applicationDeadline,
        receiverFullName: req.body.receiverFullName,
        receiverEmail: req.body.receiverEmail,
        receiverPhone: req.body.receiverPhone,
      },
    },
    { new: true }
  );

  if (!updateJob) throw new Error("Update job is fail");

  return res.status(200).json({
    success: true,
    message: "Update job is successfully",
    data: updateJob,
  });
});

const deleteJob = asyncHandler(async (req, res) => {
  const deleteAddressInterview = await Address.findOneAndDelete({
    _id: req.address._id,
  });

  if (!deleteAddressInterview) throw new Error("Delete address is fail");

  const deleteJob = await Job.findOneAndDelete({ _id: req.job._id });

  if (!deleteJob) throw new Error("Delete job is fail");

  return res.status(200).json({
    success: true,
    message: "Delete job is successfully",
  });
});

const toggleHiringStatusJob = asyncHandler(async (req, res) => {
  const findJob = await Job.findOne({ _id: req.job._id });

  if (!findJob) throw new Error("Job is not find");

  findJob.isHiring = !findJob.isHiring;

  await findJob.save();

  return res.status(200).json({
    success: true,
    messsage: "Toggle hiring status job is successfully",
    data: findJob,
  });
});

const getListJobs = asyncHandler(async (req, res) => {
  const { query } = req;
  const search = query.search || "";
  const regex = search
    .split(" ")
    .filter((q) => q)
    .join("|");
  const sortBy = query.sortBy || "-_id";
  const orderBy = ["asc", "desc"].includes(query.orderBy)
    ? query.orderBy
    : "asc";
  const limit = query.limit > 0 ? Number(query.limit) : 6;
  const page = query.page > 0 ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const industryArr = parseArrayQueryParam("industry", query);
  const jobTypeArr = parseArrayQueryParam("jobType", query);
  const genderArr = parseArrayQueryParam("gender", query);
  const levelArr = parseArrayQueryParam("level", query);
  const experienceArr = parseArrayQueryParam("experience", query);
  const rating =
    query.rating && query.rating > 0 && query.rating < 6
      ? Number(query.rating)
      : -1;
  const salaryFrom =
    query.salaryFrom && query.salaryFrom > 0 ? Number(query.salaryFrom) : -1;
  const salaryTo =
    query.salaryTo && query.salaryTo > 0 ? Number(query.salaryTo) : -1;

  const filterArgs = {
    $or: [
      { recruitmentCampaignName: { $regex: regex, $options: "i" } },
      { industry: { $regex: regex, $options: "i" } },
      { recruitmentTitle: { $regex: regex, $options: "i" } },
      { jobDescription: { $regex: regex, $options: "i" } },
      { candidateRequirements: { $regex: regex, $options: "i" } },
      { candidateBenefits: { $regex: regex, $options: "i" } },
    ],
    status: "active",
  };

  if (industryArr !== -1) filterArgs.industry = { $in: industryArr };
  if (jobTypeArr !== -1) filterArgs.jobType = { $in: jobTypeArr };
  if (genderArr !== -1) filterArgs.gender = { $in: genderArr };
  if (levelArr !== -1) filterArgs.level = { $in: levelArr };
  if (experienceArr !== -1) filterArgs.experience = { $in: experienceArr };
  if (typeof rating !== "undefined" && rating !== -1) {
    filterArgs.rating = { $gte: rating };
  }
  if (typeof salaryFrom !== "undefined" && salaryFrom !== -1) {
    filterArgs.salaryFrom = { $gte: salaryFrom };
  }

  if (typeof salaryTo !== "undefined" && salaryTo !== -1) {
    filterArgs.salaryTo = { $lte: salaryTo };
  }

  const countJobs = await Job.countDocuments(filterArgs);

  const totalPage = Math.ceil(countJobs / limit);

  const listJobs = await Job.find(filterArgs)
    .sort({ [sortBy]: orderBy, _id: -1 })
    .skip(skip)
    .limit(limit)
    .populate("workRegion")
    // .populate("categoryId", "name")
    .populate("employerId");

  return res.status(200).json({
    success: true,
    message: "Get list jobs are successfully",
    totalPage,
    currentPage: page,
    count: countJobs,
    data: listJobs,
  });
});

const getListJobForEmployer = asyncHandler(async (req, res) => {
  const { query } = req;
  const search = query.search || "";
  const regex = search
    .split(" ")
    .filter((q) => q)
    .join("|");
  const sortBy = query.sortBy || "-_id";
  const orderBy = ["asc", "desc"].includes(query.orderBy)
    ? query.orderBy
    : "asc";
  const limit = query.limit > 0 ? Number(query.limit) : 6;
  const page = query.page > 0 ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const status = req.query.status ? req.query.status : -1;
  const experience = req.query.experience ? req.query.experience : -1;
  // const categoryId = req.query.categoryId ? req.query.categoryId : -1;
  const rating =
    req.query.rating && req.query.rating > 0 && req.query.rating < 6
      ? Number(req.query.rating)
      : -1;
  const salaryFrom =
    req.query.salaryFrom && req.query.salaryFrom > 0
      ? Number(req.query.salaryFrom)
      : -1;
  const salaryTo =
    req.query.salaryTo && req.query.salaryTo > 0
      ? Number(req.query.salaryTo)
      : -1;

  const filterArgs = {
    $or: [
      { recruitmentCampaignName: { $regex: regex, $options: "i" } },
      { industry: { $regex: regex, $options: "i" } },
      { recruitmentTitle: { $regex: regex, $options: "i" } },
    ],
    employerId: req.employer._id,
  };

  if (status !== -1) filterArgs.status = status;
  if (experience !== -1) filterArgs.experience = experience;
  if (typeof rating !== "undefined" && rating !== -1) {
    filterArgs.rating = { $gte: rating };
  }
  if (typeof salaryFrom !== "undefined" && salaryFrom !== -1) {
    filterArgs.salaryFrom = { $gte: salaryFrom };
  }

  if (typeof salaryTo !== "undefined" && salaryTo !== -1) {
    filterArgs.salaryTo = { $lte: salaryTo };
  }

  const countJobs = await Job.countDocuments(filterArgs);

  const totalPage = Math.ceil(countJobs / limit);

  const listJobs = await Job.find(filterArgs)
    .sort({ [sortBy]: orderBy, _id: -1 })
    .skip(skip)
    .limit(limit)
    .populate("workRegion")
    // .populate("categoryId", "name")
    .populate("employerId");

  return res.status(200).json({
    success: true,
    message: "Get list jobs are successfully",
    totalPage,
    currentPage: page,
    count: countJobs,
    data: listJobs,
  });
});

const getListJobForAdmin = asyncHandler(async (req, res) => {});

module.exports = {
  jobById,
  getJobDetail,
  createJob,
  editJob,
  deleteJob,
  toggleHiringStatusJob,
  getListJobs,
  getListJobForEmployer,
  getListJobForAdmin,
};
