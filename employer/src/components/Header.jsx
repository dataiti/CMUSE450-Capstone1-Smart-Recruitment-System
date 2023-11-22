import React from "react";
import { authSelect, logOut } from "../redux/features/slices/authSlice";
import {
  Avatar,
  Button,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from "@material-tailwind/react";
import { icons } from "../utils/icons";
import { images } from "../assets/images";
import { titleSelect } from "../redux/features/slices/titleSlice";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useLogOutMutation } from "../redux/features/apis/authApi";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { name } = useSelector(titleSelect);

  const { isLoggedIn, user, refreshToken } = useSelector(authSelect);

  const [logout] = useLogOutMutation();

  const handleLogout = async () => {
    try {
      const response = await logout({ refreshToken });
      if (response && response.data && response.data.success) {
        dispatch(logOut());
        navigate("/login");
        toast.success("Đăng xuất thành công !");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center bg-[#212f3f] h-full px-6">
      <div className="h-full w-[300px] flex items-center gap-2">
        <img src={images.logo} alt="logo" className="w-10" />
        <Typography className="text-xs font-bold text-white">
          Kênh nhà tuyển dụng
        </Typography>
      </div>
      <div className="h-full w-full flex items-center justify-between">
        <Typography className="text-light-blue-500 font-bold uppercase">
          {name}
        </Typography>
        <div className="flex items-center gap-2">
          <button className="shadow-none p-3 rounded-full bg-white text-[#0891b2] relative z-20">
            <icons.PiBellRingingFill size={20} />
            <span className="absolute z-30 top-[-3px] right-[-3px] bg-red-500 p-[3px] rounded-full text-white">
              <icons.IoAlertSharp size={12} />
            </span>
          </button>
          <Link to="/message">
            <button className="shadow-none p-3 rounded-full bg-white text-[#0891b2] relative z-20">
              <icons.BsMessenger size={20} />
              <span className="absolute z-30 top-[-3px] right-[-3px] bg-red-500 p-[3px] rounded-full text-white">
                <icons.IoAlertSharp size={12} />
              </span>
            </button>
          </Link>
          {isLoggedIn && (
            <Menu>
              <MenuHandler>
                <Button
                  variant="text"
                  className="text-base font-normal capitalize tracking-normal shadow-none active:shadow-none flex items-center gap-2 p-1 rounded-full bg-[#0891b2] cursor-pointer hover:bg-[#06b6d4] active:bg-[#06b6d4] transition-all"
                >
                  <Avatar
                    variant="circular"
                    alt={`${user?.firstName} ${user?.lastName}`}
                    className="h-10 w-10 border-2 border-white hover:z-10 focus:z-10 "
                    src={user?.avatar}
                  />
                  <div>
                    <Typography className="text-sm font-bold">{`${user?.firstName} ${user?.lastName}`}</Typography>
                    <Typography className="text-xs font-bold text-white">
                      {user?.email}
                    </Typography>
                  </div>
                  <icons.FiChevronDown />
                </Button>
              </MenuHandler>
              <MenuList className="hover:border-none">
                <MenuItem
                  className="bg-gray-200 flex items-center gap-4 py-3"
                  onClick={handleLogout}
                >
                  <icons.IoLogOutOutline size={24} />
                  <Typography
                    color="blue-gray"
                    className="mb-1 text-sm font-medium"
                  >
                    Đăng xuất
                  </Typography>
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
