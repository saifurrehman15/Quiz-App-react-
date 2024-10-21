import React, { useContext, useState, useEffect } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  BarChartOutlined,
  LogoutOutlined,
  SettingFilled,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, Drawer } from "antd";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { userContext } from "../context/userContext";
import { auth } from "../utils/firebase";
import { signOut } from "firebase/auth";
import LoaderPage from "./loaderComponent";
import { quizSubjects } from "../context/subjectContext";

const { Header, Sider, Content } = Layout;

const LayoutFunc = () => {
  const [loader, setLoader] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const { users } = useContext(userContext);
  const { url: image, id } = users || {};
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoader(true); // Show loader when location changes
    const timer = setTimeout(() => {
      setLoader(false); // Hide loader after 2.5 seconds
    }, 2500);

    return () => clearTimeout(timer); // Cleanup the timeout
  }, []); // Dependency array with location

  const manage =
    id === "QJe3N4SLsJYDnYk3qSBPnRkiBwt1"
      ? {
          key: "4",
          icon: <SettingFilled />,
          label: <Link to={`/admin/managequiz`}>Manage Quiz-App</Link>,
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
    <div>
      {loader ? (
        <LoaderPage />
      ) : (
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
                style={{
                  backgroundColor: "rgb(22, 22, 22)",
                  marginTop: "15px",
                }}
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
                  manage,

                  {
                    key: "3",
                    icon: <LogoutOutlined />,
                    label: (
                      <button onClick={() => handleSignout()}>Logout</button>
                    ),
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
                {image ? (
                  <img
                    src={image}
                    alt={users?.userName}
                    height={40}
                    width={40}
                    className="rounded-full border border-gray-500 shadow-sm" // Dark border
                  />
                ) : (
                  <div
                    className="rounded-full h-10 flex justify-center items-center w-10 border border-gray-500 shadow-sm" // Dark border
                  >
                    <UserOutlined  style={{color:"blue"}}/>
                  </div>
                )}
                <span className="ml-2 text-white font-semibold">
                  {users?.userName}
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
      )}
    </div>
  );
};

export default LayoutFunc;
