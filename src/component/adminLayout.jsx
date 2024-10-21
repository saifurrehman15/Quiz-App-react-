import React, { useContext, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  PieChartOutlined,
  PoweroffOutlined,
  FileDoneOutlined,
  WarningOutlined,
  BarChartOutlined,
  BookFilled,
  ReadOutlined,
  FormOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, Drawer } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { userContext } from "../context/userContext";
import { auth } from "../utils/firebase";
import { signOut } from "firebase/auth";

const { Header, Sider, Content } = Layout;

const AdminLayoutFunc = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { users } = useContext(userContext);
  const { url: image, id } = users || {};
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const manage =
    id === "OVvVAmV8PsODK1W0tluYAVmRWqG3"
      ? {
          key: "1",
          icon: <FileDoneOutlined />, // Changed to FileDoneOutlined for Manage Quiz
          label: <Link to={`/admin/managequiz`}>Make Quiz</Link>,
        }
      : "";

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleSignout = () => {
    signOut(auth)
      .then(() => {
        navigate("auth/signup");
      })
      .catch((error) => {
        console.error("Sign out error:", error);
      });
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout className="h-screen" style={{ backgroundColor: "#2c3e50" }}>
      {/* Drawer for mobile */}
      <Drawer title="Menu" onClose={onClose} open={open} width={"70%"}>
        <Menu
          mode="inline"
          theme="dark"
          items={[
            {
              key: "1",
              icon: <HomeOutlined />, // Changed to DashboardOutlined for Dashboard
              label: <Link to="/">Home</Link>,
            },

            manage,
            {
              key: "4",
              icon: <ReadOutlined />,
              label: <Link to={`/admin/courses`}>Courses</Link>,
            },
            {
              key: "5",
              icon: <FormOutlined />,
              label: <Link to={`/admin/addsubject`}>Subjects</Link>,
            },
            {
              key: "6",
              icon: <WarningOutlined />,
              label: <Link to={`/admin/report`}>Reports</Link>,
            },
            {
              key: "7",
              icon: <PoweroffOutlined />, // Changed to PoweroffOutlined for Logout
              label: <button onClick={handleSignout}>Logout</button>,
            },
          ]}
        />
      </Drawer>

      {/* Sidebar for larger screens */}
      {window.innerWidth >= 430 && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{
            backgroundColor: "#34495e",
            boxShadow: "2px 0 10px rgba(0, 0, 0, 0.5)",
          }}
        >
          <Menu
            theme="dark"
            style={{ backgroundColor: "#34495e", marginTop: "15px" }}
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={[
              {
                key: "3",
                icon: <HomeOutlined />, // Changed to DashboardOutlined for Dashboard
                label: <Link to="/">Home</Link>,
              },
              manage,
              {
                key: "4",
                icon: <ReadOutlined />,
                label: <Link to={`/admin/courses`}>Courses</Link>,
              },
              {
                key: "5",
                icon: <FormOutlined />,
                label: <Link to={`/admin/addsubject`}>Subjects</Link>,
              },
              {
                key: "6",
                icon: <WarningOutlined />,
                label: <Link to={`/admin/report`}>Reports</Link>,
              },
              {
                key: "7",
                icon: <PoweroffOutlined />, // Changed to PoweroffOutlined for Logout
                label: <button onClick={handleSignout}>Logout</button>,
              },
            ]}
          />
        </Sider>
      )}
      <Layout className="layout">
        <Header
          style={{
            padding: "0 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#1c2833",
            boxShadow: "0 1px 4px rgba(0, 0, 0, 0.5)",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => {
              window.innerWidth >= 430
                ? setCollapsed(!collapsed)
                : showDrawer();
            }}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
              color: "#ecf0f1",
            }}
            aria-label="Toggle menu"
          />
          <div className="flex items-center">
            <img
              src={image}
              alt={users?.userName}
              height={40}
              width={40}
              className="rounded-full border border-gray-500 shadow-sm"
            />
            <span className="ml-2 text-white font-semibold">
              {users?.userName}
            </span>
          </div>
        </Header>

        <Content
          style={{
            padding: 24,
            background: "#34495e",
            minHeight: 280,
            overflowY: "auto",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayoutFunc;
