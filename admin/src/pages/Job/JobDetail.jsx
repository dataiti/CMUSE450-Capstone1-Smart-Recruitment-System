import { IconButton, Typography } from "@material-tailwind/react";
import React from "react";
import { icons } from "../../utils/icons";
import parse from "html-react-parser";

const JobDetail = ({ jobDetailData = {} }) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-col gap-4 bg-white p-4 rounded-md ">
        <Typography className="uppercase text-[#212f3f] font-bold text-lg">
          {jobDetailData?.recruitmentTitle}
        </Typography>
        <div className="grid grid-cols-3">
          <div className="flex items-center gap-2">
            <IconButton className="rounded-full bg-[#fde68a]">
              <icons.AiFillDollarCircle size={30} />
            </IconButton>
            <div className="flex flex-col gap-2">
              <Typography className="font-bold">Mức lương</Typography>
              <Typography className="text-xs font-bold">
                {jobDetailData?.experience}
              </Typography>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <IconButton className="rounded-full bg-[#fde68a]">
              <icons.HiLocationMarker size={30} />
            </IconButton>
            <div className="flex flex-col gap-2">
              <Typography className="font-bold">Địa điểm</Typography>
              <Typography className="text-xs font-bold">
                {jobDetailData?.workRegion?.province}
              </Typography>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <IconButton className="rounded-full bg-[#fde68a]">
              <icons.AiFillClockCircle size={30} />
            </IconButton>
            <div className="flex flex-col gap-2">
              <Typography className="font-bold">Kinh nghiệm</Typography>
              <Typography className="text-xs font-bold">
                {jobDetailData?.experience}
              </Typography>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-md ">
        <Typography className="border-b-4 border-[#164e63] uppercase text-sm font-bold pb-1">
          Mô tả công việc
        </Typography>
        <div className="text-sm font-bold py-2">
          {(jobDetailData.jobDescription &&
            parse(jobDetailData.jobDescription)) ||
            ""}
        </div>
      </div>
      <div className="bg-white p-4 rounded-md ">
        <Typography className="border-b-4 border-[#164e63] uppercase text-sm font-bold pb-1">
          Yêu cầu ứng viên
        </Typography>
        <div className="text-sm font-bold py-2">
          {(jobDetailData.candidateRequirements &&
            parse(jobDetailData.candidateRequirements)) ||
            ""}
        </div>
      </div>
      <div className="bg-white p-4 rounded-md ">
        <Typography className="border-b-4 border-[#164e63] uppercase text-sm font-bold pb-1">
          Phúc lợi ứng viên
        </Typography>
        <div className="text-sm font-bold py-2">
          {(jobDetailData.candidateBenefits &&
            parse(jobDetailData.candidateBenefits)) ||
            ""}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
