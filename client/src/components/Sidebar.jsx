import { IconButton, Typography } from "@material-tailwind/react";
import React from "react";
import { Link } from "react-router-dom";
import { sidebarItems } from "../utils/constants";
import { images } from "../assets/images";

const Sidebar = () => {
  return (
    <div className="flex flex-col items-center gap-7 py-4">
      <img
        className="h-14 w-14 rounded-lg object-cover"
        src={images.logo}
        alt=""
      />
      <div className="flex flex-col gap-7">
        {sidebarItems.map((item) => {
          return (
            <Link
              to={item.path}
              className="flex flex-col gap-2 items-center"
              key={item.id}
            >
              <IconButton>{item.icon}</IconButton>
              <Typography className="text-white text-xs font-bold">
                {item.name}
              </Typography>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
