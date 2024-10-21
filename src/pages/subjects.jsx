import React, { useEffect, useState, useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link, useParams } from "react-router-dom";

import { userContext } from "../context/userContext";
import { quizSubjects } from "../context/subjectContext";

import { Button, message, Spin, Form, Input, Modal, Switch } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  DeleteOutlined,
  EditOutlined,
  CloseOutlined,
  CheckOutlined,
} from "@ant-design/icons"; // Importing the Ant Design icons
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

function SubjectSelect() {
  const { course } = useParams();
  const { users } = useContext(userContext);
  const { setSubjects, setCategory, subjectData } = useContext(quizSubjects);
  const { id } = users;
  const [loading, setLoader] = useState(true);

  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [courseId, setId] = useState("");
  const [deleted, setDeleted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  console.log(course);

  useEffect(() => {
    setCategory(course);
  }, [course]);

  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 2000);
  }, []);
  const onFinish = async (values) => {
    try {
      console.log(values);

      setLoader(true);

      const docRef = doc(db, course, values.dataId); // Assuming id is course ID
      await updateDoc(docRef, {
        active: values.active,
      });
      setCategory(course);

      setLoader(false);
      message.success("Subject is active successfully.");
      setIsModalOpen(false); // Close modal after successful update
    } catch (error) {
      console.error("Error updating document: ", error);
      message.error("Failed to update course, please try again.");
      setLoader(false);
    }
  };

  const showModal = (course) => {
    form.resetFields();
    console.log(course?.id);
    form.setFieldsValue({
      active: course?.subjectDetails?.active,
      dataId: course?.id,
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const showModal2 = () => {
    setIsModalOpen2(true);
  };
  const handleCancel2 = () => {
    setIsModalOpen2(false);
  };

  const handleDelete = async (courseId) => {
    try {
      const courseRef = doc(db, course, courseId);
      setDeleted(true);
      await deleteDoc(courseRef);
      setDeleted(false);
      handleCancel2();
      message.success("Subject deleted successfully.");
    } catch (error) {
      console.error("Error deleting course:", error);
      message.error("Failed to delete subject.");
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center">
          <Spin />
        </div>
      ) : (
        <div>
          <Modal
            title="Edit Course"
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
          >
            <Form
              form={form} // Bind form instance
              name="courses_form"
              onFinish={onFinish}
              style={{ maxWidth: 600, margin: "auto" }}
            >
              <Form.Item label="Data Id" name="dataId" hidden>
                <Input />
              </Form.Item>
              {/* Course Input */}

              {/* Active Switch */}
              <Form.Item
                label="Active"
                name="active"
                valuePropName="checked" // Bind the Switch's checked state
              >
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                />
              </Form.Item>

              {/* Submit Button */}
              <Form.Item>
                <Button
                  htmlType="submit"
                  className="w-full bg-black text-white"
                >
                  {loading ? <Spin /> : "Update the Course"}
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          <Modal
            title={<h1 className="font-bold text-blue-400">QuizAce</h1>}
            open={isModalOpen2}
            onCancel={handleCancel2}
            footer={
              <div className="flex gap-2 justify-end">
                <button
                  onClick={handleCancel2}
                  className="border border-blue-400 p-1 rounded px-8"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleDelete(courseId);
                  }}
                  className="bg-red-500 text-white p-1 px-8 rounded"
                >
                  {deleted ? <Spin /> : "Delete"}
                </button>
              </div>
            }
          >
            <h2 className="font-bold">
              Are you sure! you want to delete this subject?
            </h2>
          </Modal>

          <h1
            style={{
              textAlign: "center",
              marginBottom: "40px",
            }}
            className="font-bold text-2xl text-gray-300"
          >
            Select Your Quiz ({course})
          </h1>

          {subjectData.length > 0 ? (
            <>
              {/* Previous and Next buttons with Ant Design chevron icons */}
              <div className="flex justify-end gap-4 mb-4">
                <button
                  className="bg-blue-500 hover:bg-gray-500 text-white p-2  rounded-full flex items-center justify-center"
                  id="prevBtn"
                >
                  <LeftOutlined /> {/* Previous button icon */}
                </button>
                <button
                  className="bg-blue-500 hover:bg-gray-500 text-white p-2 rounded-full flex items-center justify-center"
                  id="nextBtn"
                >
                  <RightOutlined /> {/* Next button icon */}
                </button>
              </div>

              <Swiper
                spaceBetween={30}
                slidesPerView={3}
                navigation={{
                  prevEl: "#prevBtn",
                  nextEl: "#nextBtn",
                }}
                pagination={{ clickable: true }}
                modules={[Navigation, Pagination]}
                style={{
                  width: "100%",
                  height: "250px",
                  padding: "10px",
                }}
                breakpoints={{
                  320: { slidesPerView: 1 },
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
              >
                {subjectData.map((subject, index) => (
                  <SwiperSlide key={index}>
                    <div
                      style={{
                        backgroundImage:
                          "linear-gradient(135deg, #2C3E50, #4CA1AF)", // More professional gradient: Dark navy and teal
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "4px",
                        padding: "20px",
                        borderRadius: "20px",
                        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        textAlign: "center",
                        position: "relative",
                      }}
                      className="hover:transform hover:scale-105 hover:shadow-lg"
                    >
                      <div className="absolute top-1 right-2 flex">
                        {id === "QJe3N4SLsJYDnYk3qSBPnRkiBwt1" && (
                          <div>
                            <Button
                              icon={<EditOutlined />}
                              onClick={() => showModal(subject)}
                              className="mr-2 rounded-full"
                            />
                            <Button
                              icon={<DeleteOutlined />}
                              danger
                              className="rounded-full"
                              onClick={() => {
                                setId(subject.id);
                                showModal2();
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <h2
                        className="text-3xl font-bold mb-4 text-gray-100" // White text for contrast
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          letterSpacing: "1px",
                        }}
                      >
                        {subject.subjectDetails?.quizName}
                      </h2>
                      <p
                        className="text-gray-300"
                        style={{ fontSize: "1.1rem" }}
                      >
                        <strong>Total Time:</strong>{" "}
                        {subject.subjectDetails?.totalTime} min
                      </p>
                      <div className="mt-5">
                        <Link
                          className="bg-teal-500 text-white rounded-md p-2 px-6 shadow-lg transition duration-300 hover:bg-teal-600 hover:shadow-xl"
                          to={`/quiz/${subject.subjectDetails?.quizName}/${subject.subjectDetails?.key}/${course}/${subject.subjectDetails?.totalTime}/${id}/${subject.subjectDetails?.active}`}
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          Start Quiz
                        </Link>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </>
          ) : (
            <h1 className="text-red-500 text-2xl text-center">
              Oops! Data not found
            </h1>
          )}
        </div>
      )}
    </>
  );
}

export default SubjectSelect;
