import React from "react";
import { Typography } from "@material-tailwind/react";

export const TextMessage = ({ el }) => {
  return (
    <div className={`flex ${el.incoming ? "justify-start" : "justify-end"} `}>
      <div
        className={`${
          el.incoming ? "bg-gray-400" : "bg-[#212f3f] text-white"
        } px-4 py-3 rounded-2xl`}
      >
        <Typography>{el.message}</Typography>
      </div>
    </div>
  );
};

export const ReplyMessage = ({ el }) => {
  return (
    <div className={`flex ${el.incoming ? "justify-start" : "justify-end"} `}>
      <div className="flex flex-col gap-2"></div>
    </div>
  );
};

export const MediaMessage = ({ el }) => {
  return (
    <div className={`flex ${el.incoming ? "justify-start" : "justify-end"} `}>
      {/* <div>
        <Typography>{el.message}</Typography>
      </div> */}
    </div>
  );
};
