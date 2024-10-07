import React, { useContext, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  BarChartOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, Drawer } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { userContext } from "../context/userContext";
import { auth } from "../utils/firebase";
import { signOut } from "firebase/auth";

const { Header, Sider, Content } = Layout;

const LayoutFunc = () => {
  const [collapsed, setCollapsed] = useState(false);
  const userDetails = useContext(userContext);
  const { url: image, id } = userDetails || {};
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

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
    <Layout className="h-screen" style={{ backgroundColor: "#1a1a1a" }}>
      {/* Dark background for the layout */}
      <Drawer title="Menu" onClose={onClose} open={open} width={"70%"}>
        <Menu
          mode="inline"
          theme="dark"
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: <Link to="/">Dashboard</Link>,
            },
            {
              key: "2",
              icon: <BarChartOutlined />,
              label: <Link to={`/result/${id}`}>Result</Link>,
            },
            {
              key: "3",
              icon: <LogoutOutlined />,
              label: <button onClick={handleSignout}>Logout</button>,
            },
          ]}
        />
      </Drawer>
      {window.innerWidth >= 430 && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{
            backgroundColor: "rgb(22, 22, 22)",
            boxShadow: "2px 0 10px rgba(0, 0, 0, 0.5)", // Added shadow for depth
          }}
        >
          {/* Darker sidebar */}
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            style={{ backgroundColor: "rgb(22, 22, 22)" }}
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={[
              {
                key: "1",
                icon: <UserOutlined />,
                label: <Link to="/">Dashboard</Link>,
              },
              {
                key: "2",
                icon: <BarChartOutlined />,
                label: <Link to={`/result/${id}`}>Result</Link>,
              },
              {
                key: "3",
                icon: <LogoutOutlined />,
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
            backgroundColor: "rgb(22, 22, 22)", // Dark gray for header
            boxShadow: "0 1px 4px rgba(0, 0, 0, 0.5)", // Added shadow for depth
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
              color: "#fff", // White icon color
            }}
            aria-label="Toggle menu"
          />
          <div className="flex items-center">
            <img
              src={image || "default-image-url"} // Fallback image
              alt={userDetails?.userName || "User"}
              height={40}
              width={40}
              className="rounded-full border border-gray-500 shadow-sm" // Dark border
            />
            <span className="ml-2 text-white font-semibold">
              {userDetails?.userName}
            </span>
          </div>
        </Header>

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: "rgb(22, 22, 22)", // Dark background for content
            borderRadius: borderRadiusLG,
            minHeight: 280,
            overflowY: "auto",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)", // Light shadow for content
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutFunc;
