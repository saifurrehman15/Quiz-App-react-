import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "bootstrap/dist/css/bootstrap.min.css";
import { userContext } from "../context/userContext";
import { useContext } from "react";
import React from "react";
import {
  DownOutlined,
  BarChartOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { signOut } from "firebase/auth";
import { Dropdown, Space } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../utils/firebase";

function NavScrollExample() {
  const users = useContext(userContext);
  const { id } = users;
  console.log(id);
  const navigate = useNavigate();
  console.log(users);
  const handleSignout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate("auth/signup");
      })
      .catch((error) => {
        // An error happened.
      });
  };
  const items = [
    {
      label: (
        <Link to={`/result/${id}`} className="flex gap-2 no-underline">
          <BarChartOutlined />
          Result
        </Link>
      ),
      key: "0",
    },
    {
      type: "divider",
    },
    {
      label: (
        <button className="flex gap-2 items-center" onClick={handleSignout}>
          <LogoutOutlined />
          Logout
        </button>
      ),
      key: "1",
    },
  ];
  return (
    <Navbar expand="lg" className="bg-blue-500 navbar fixed-top h-[65px]">
      <Container fixed>
        <Navbar.Brand href="#" className="text-white font-bold">
          Quiz App
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="navbarScroll"
          className="bg-danger h-8 w-12 flex justify-center items-center"
        />
        <Navbar.Collapse id="navbarScroll" className="flex flex-col">
          <div className="d-flex flex-wrap mt-2 items-center gap-2 ms-auto">
            <img src={users?.url} alt="user" className="h-8 w-8 rounded-full" />
            <Dropdown
              menu={{
                items,
              }}
              trigger={["click"]}
            >
              <Link onClick={(e) => e.preventDefault()} className="text-white">
                <Space>
                  <span className="text-white">
                    {users.displayName || "User"}
                  </span>
                  <DownOutlined />
                </Space>
              </Link>
            </Dropdown>
            {id === "OVvVAmV8PsODK1W0tluYAVmRWqG3" ? (
              <button className="text-white py-1 px-2  rounded bg-blue-400 flex gap-2 items-center">
                <SettingOutlined />
                Manage Quiz
              </button>
            ) : (
              ""
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;
