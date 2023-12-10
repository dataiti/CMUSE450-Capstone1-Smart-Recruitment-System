import React, { useState } from "react";
import ParentType from "../shares/ParentType";
import Project from "./Project";
import Skills from "./Skills";
import Modal from "../../shares/Modal";
import { Typography } from "@material-tailwind/react";
import { icons } from "../../../utils/icons";
import ProfessionalProfile from "./ProfessionalProfile";
import WorkExperience from "./WorkExperience";

const Parent = () => {
  const [open, setOpen] = useState(false);
  const [indexAdd, setIndexAdd] = useState(0);
  const [typeAdd, setTypeAdd] = useState("");
  const [divs, setDivs] = useState([
    { id: 1, type: "contact", content: "" },
    { id: 2, type: "profile", content: "" },
    { id: 3, type: "skill", content: "" },
    { id: 4, type: "experience", content: "" },
    { id: 5, type: "project", content: "" },
  ]);

  const [editedContents, setEditedContents] = useState(
    divs.map((div) => div.content)
  );

  const handleMoveUp = (index) => {
    if (index > 0) {
      const newDivs = [...divs];
      [newDivs[index - 1], newDivs[index]] = [
        newDivs[index],
        newDivs[index - 1],
      ];

      const newEditedContents = [...editedContents];
      [newEditedContents[index - 1], newEditedContents[index]] = [
        newEditedContents[index],
        newEditedContents[index - 1],
      ];

      setDivs(newDivs);
      setEditedContents(newEditedContents);
    }
  };

  const handleMoveDown = (index) => {
    if (index < divs.length - 1) {
      const newDivs = [...divs];
      [newDivs[index], newDivs[index + 1]] = [
        newDivs[index + 1],
        newDivs[index],
      ];

      const newEditedContents = [...editedContents];
      [newEditedContents[index], newEditedContents[index + 1]] = [
        newEditedContents[index + 1],
        newEditedContents[index],
      ];

      setDivs(newDivs);
      setEditedContents(newEditedContents);
    }
  };

  const handleContentChange = (index, newContent) => {
    const newEditedContents = [...editedContents];
    newEditedContents[index] = newContent;
    setEditedContents(newEditedContents);
  };

  const handleAddAbove = (index) => {
    setOpen(true);
    setTypeAdd("above");
    setIndexAdd(index);
  };

  const addAbove = ({ type }) => {
    if (type) {
      const newDivs = [...divs];
      const newEditedContents = [...editedContents];

      newDivs.splice(indexAdd, 0, {
        id: Date.now(),
        type: type,
        content: "",
      });
      newEditedContents.splice(indexAdd, 0, "");

      setDivs(newDivs);
      setEditedContents(newEditedContents);
      setOpen(false);
    }
  };

  const handleAddBelow = (index) => {
    setOpen(true);
    setTypeAdd("below");
    setIndexAdd(index);
  };

  const addBelow = ({ type }) => {
    if (type) {
      const newDivs = [...divs];
      const newEditedContents = [...editedContents];

      newDivs.splice(indexAdd + 1, 0, {
        id: Date.now(),
        type: type,
        content: "",
      });
      newEditedContents.splice(indexAdd + 1, 0, "");

      setDivs(newDivs);
      setEditedContents(newEditedContents);
      setOpen(false);
    }
  };

  const handleDelete = (index) => {
    const newDivs = [...divs];
    const newEditedContents = [...editedContents];

    newDivs.splice(index, 1);
    newEditedContents.splice(index, 1);

    setDivs(newDivs);
    setEditedContents(newEditedContents);
  };

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <div className="w-full flex flex-col gap-2">
        <div className="flex flex-col gap-3">
          {divs.map((div, index) => (
            <div key={div.id}>
              <ParentType
                handleMoveUp={() => handleMoveUp(index)}
                handleMoveDown={() => handleMoveDown(index)}
                handleAddAbove={() => handleAddAbove(index)}
                handleAddBelow={() => handleAddBelow(index)}
                handleDelete={() => handleDelete(index)}
                dangerouslySetInnerHTML={{ __html: editedContents[index] }}
                handleContentChange={(e) =>
                  handleContentChange(index, e.target.innerHTML)
                }
                title={div.type}
              >
                {div.type === "project" && <Project t />}
                {div.type === "skill" && <Skills />}
                {div.type === "profile" && <ProfessionalProfile />}
                {div.type === "experience" && <WorkExperience />}
              </ParentType>
            </div>
          ))}
        </div>
        <Modal open={open} handleOpen={setOpen} size="lg">
          <div className="p-5 rounded-md">
            <Typography>Thêm thành phần mới</Typography>
            <div className="grid grid-cols-4 gap-5">
              <button
                className="flex flex-col justify-center p-2 rounded-md items-center gap-2 bg-blue-gray-50 hover:bg-blue-gray-100 transition-all h-32"
                onClick={() => {
                  typeAdd === "above"
                    ? addAbove({ type: "contact" })
                    : addBelow({ type: "contact" });
                }}
              >
                <icons.FaUserAlt size={30} />
                <Typography className="text-sm font-bold">
                  Thông tin liên hệ
                </Typography>
              </button>
              <button
                className="flex flex-col justify-center p-2 rounded-md items-center gap-2 bg-blue-gray-50 hover:bg-blue-gray-100 transition-all h-32"
                onClick={() => {
                  typeAdd === "above"
                    ? addAbove({ type: "profile" })
                    : addBelow({ type: "profile" });
                }}
              >
                <icons.FaUserAlt size={30} />
                <Typography className="text-sm font-bold">
                  Giới thiệu bản thân
                </Typography>
              </button>
              <button
                className="flex flex-col justify-center p-2 rounded-md items-center gap-2 bg-blue-gray-50 hover:bg-blue-gray-100 transition-all h-32"
                onClick={() => {
                  typeAdd === "above"
                    ? addAbove({ type: "skill" })
                    : addBelow({ type: "skill" });
                }}
              >
                <icons.FaUserAlt size={30} />
                <Typography className="text-sm font-bold">Kỹ năng</Typography>
              </button>
              <button
                className="flex flex-col justify-center p-2 rounded-md items-center gap-2 bg-blue-gray-50 hover:bg-blue-gray-100 transition-all h-32"
                onClick={() => {
                  typeAdd === "above"
                    ? addAbove({ type: "experience" })
                    : addBelow({ type: "experience" });
                }}
              >
                <icons.FaUserAlt size={30} />
                <Typography className="text-sm font-bold">
                  Kinh nghiệm làm việc
                </Typography>
              </button>
              <button
                className="flex flex-col justify-center p-2 rounded-md items-center gap-2 bg-blue-gray-50 hover:bg-blue-gray-100 transition-all h-32"
                onClick={() => {
                  typeAdd === "above"
                    ? addAbove({ type: "project" })
                    : addBelow({ type: "project" });
                }}
              >
                <icons.FaUserAlt size={30} />
                <Typography className="text-sm font-bold">
                  Dự án đã làm
                </Typography>
              </button>
              <button className="flex flex-col justify-center p-2 rounded-md items-center gap-2 bg-blue-gray-50 hover:bg-blue-gray-100 transition-all h-32">
                <icons.FaUserAlt size={30} />
                <Typography className="text-sm font-bold">Chứng chỉ</Typography>
              </button>
              <button className="flex flex-col justify-center p-2 rounded-md items-center gap-2 bg-blue-gray-50 hover:bg-blue-gray-100 transition-all h-32">
                <icons.FaUserAlt size={30} />
                <Typography className="text-sm font-bold">
                  Giải thưởng
                </Typography>
              </button>
              <button className="flex flex-col justify-center p-2 rounded-md items-center gap-2 bg-blue-gray-50 hover:bg-blue-gray-100 transition-all h-32">
                <icons.FaUserAlt size={30} />
                <Typography className="text-sm font-bold">Tuỳ chọn</Typography>
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Parent;
