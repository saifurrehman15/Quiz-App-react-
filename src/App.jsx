import { useContext, useState, useEffect } from "react";
import "./App.css";
import { userContext } from "./context/userContext";
import { Link } from "react-router-dom";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Spin,
  Switch,
  Upload,
} from "antd";
import {
  deleteDoc,
  doc,
  updateDoc,
  getDocs,
  collection,
} from "firebase/firestore"; // Import getDocs and collection for fetching courses
import { db, storage } from "./utils/firebase";
import { quizCourses } from "./context/courses";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"; // Import for file upload

function App() {
  const { users, cheatData } = useContext(userContext);
  const { displayName, id } = users;
  const { courses, setCourses } = useContext(quizCourses); // Assume setCourses is provided in quizCourses context
  const getDataId = cheatData.filter((docs) => docs.id === id);
  console.log(getDataId[0], cheatData);

  const cheatDetector = getDataId[0];

  const cheatOrNot = cheatDetector?.cheat;
  const cheatId = cheatDetector?.id;
  const timeOfSuspension = cheatDetector?.timeSuspend;

  const [suspend, setSuspend] = useState(false);
  const [received, setReceived] = useState(false);
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [courseId, setId] = useState("");
  const [form] = Form.useForm();
  console.log(cheatDetector);

  useEffect(() => {
    let timeout;
    timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetch updated courses list
  const fetchCourses = async () => {
    try {
      const coursesSnapshot = await getDocs(collection(db, "courses"));
      const updatedCourses = coursesSnapshot.docs.map((doc) => ({
        id: doc.id,
        courseData: doc.data(),
      }));
      setCourses(updatedCourses);
    } catch (error) {
      console.error("Error fetching courses: ", error);
    }
  };

  const showModal2 = () => {
    setIsModalOpen2(true);
  };
  const handleCancel2 = () => {
    setIsModalOpen2(false);
  };

  const showModal = (course) => {
    form.resetFields();
    console.log(course?.id);
    form.setFieldsValue({
      course: course?.courseData?.course,
      active: course?.courseData?.active,
      dataId: course?.id,
      icon: course?.courseData?.icon ? [{ url: course.courseData.icon }] : [],
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (values) => {
    try {
      setLoader(true);

      // Handle file upload
      let iconUrl;
      if (values.icon && values.icon[0]?.originFileObj) {
        const file = values.icon[0].originFileObj;
        const storageRef = ref(storage, `course-icons/${file.name}`); // Assuming you're using Firebase Storage
        await uploadBytes(storageRef, file);
        iconUrl = await getDownloadURL(storageRef);
      }

      const docRef = doc(db, "courses", values.dataId); // Assuming id is course ID
      await updateDoc(docRef, {
        course: values.course,
        active: values.active,
        icon: iconUrl || values.icon[0]?.url, // Use new URL if uploaded, otherwise retain old URL
      });

      setLoader(false);
      message.success("Course details updated successfully.");
      setIsModalOpen(false); // Close modal after successful update
      await fetchCourses(); // Refetch the updated courses list
    } catch (error) {
      console.error("Error updating document: ", error);
      message.error("Failed to update course, please try again.");
      setLoader(false);
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const getDateFromTimestamp = (timestamp) => {
    if (timestamp?.seconds) {
      return new Date(
        timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
      );
    }
    return null;
  };

  const convertToPakistanTime = (date) => {
    return new Date(date).toLocaleString("en-US", { timeZone: "Asia/Karachi" });
  };

  const removeData = async () => {
    try {
      const q = doc(db, "cheatDetector", id);
      await deleteDoc(q);
    } catch (error) {
      console.error("Error deleting suspension data:", error);
    }
  };

  useEffect(() => {
    if (cheatData) {
      setReceived(true);
      setSuspend(false);
    } else {
      setSuspend(true);
    }
  }, [cheatData]);

  useEffect(() => {
    if (timeOfSuspension) {
      let endSuspensionTime = getDateFromTimestamp(timeOfSuspension);
      if (endSuspensionTime) {
        endSuspensionTime.setHours(endSuspensionTime.getHours() + 10);
        endSuspensionTime = convertToPakistanTime(endSuspensionTime);
        const currentTime = convertToPakistanTime(new Date());
        if (new Date(currentTime) >= new Date(endSuspensionTime) && received) {
          removeData(); // Clear suspension data
          setSuspend(true); // Lift the suspension
          message.success("Your suspension has ended. You may proceed.");
        } else if (cheatOrNot && received) {
          setSuspend(false); // User is still suspended
        }
      }
    }
  }, [timeOfSuspension, suspend, cheatDetector]);

  const handleDelete = async (courseId) => {
    try {
      const courseRef = doc(db, "courses", courseId);
      setDeleted(true);
      await deleteDoc(courseRef);
      setDeleted(false);
      handleCancel2();
      message.success("Course deleted successfully.");
      await fetchCourses(); // Refetch the updated courses list
    } catch (error) {
      console.error("Error deleting course:", error);
      message.error("Failed to delete course.");
    }
  };

  return (
    <>
      {loading ? (
        <div className="w-full text-center">
          <Spin />
        </div>
      ) : (
        <div>
          {/* Modal for course editing */}
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
              <Form.Item label="Course Name" name="course">
                <Input placeholder="Update course name" />
              </Form.Item>
              <Form.Item
                label="Icon"
                name="icon"
                className="w-full"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[{ required: true, message: "Please upload an icon!" }]}
              >
                <Upload beforeUpload={() => false} maxCount={1}>
                  <Button>Click to Upload Icon</Button>
                </Upload>
              </Form.Item>
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
                  {loader ? <Spin /> : "Update the Course"}
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
              Are you sure! you want to delete this course?
            </h2>
          </Modal>

          <div className="text-white text-center">
            <h1 className="text-3xl sm:text-4xl mb-4 font-extrabold">
              Hi, {displayName ? displayName : "Admin"}
            </h1>
            <p className="text-lg mb-8">
              Welcome to the quiz portal. Select your course below to take a
              quiz.
            </p>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-6">
            {courses.length > 0 ? (
              courses.map((elem, ind) => (
                <div
                  className={`bg-gray-800 h-[250px] w-[300px] p-4 shadow-lg rounded-md transition-all transform hover:scale-105 hover:shadow-2xl flex flex-col justify-between items-center text-center relative`}
                  key={ind}
                >
                  <img
                    src={elem?.courseData?.icon}
                    alt={elem?.courseData?.course}
                    className="w-16 h-16 mb-4 object-cover rounded-full border-2 border-gray-700 transition-transform transform hover:scale-110"
                  />
                  <h3 className="text-lg font-bold mb-2 text-white">
                    {elem?.courseData?.course}
                  </h3>

                  <Link
                    to={
                      cheatId === id
                        ? elem?.courseData?.active && !cheatOrNot && !suspend
                          ? `/subject/${elem?.courseData?.course}/${id}`
                          : "/"
                        : elem?.courseData?.active &&
                          `/subject/${elem?.courseData?.course}/${id}`
                    }
                    onClick={() => {
                      if (!elem?.courseData?.active && !cheatOrNot) {
                        message.warning("This course is not active.");
                      }
                      if (cheatOrNot && cheatId === id) {
                        message.error(
                          "Cheating has been detected,You are supended for few hours!"
                        );
                      }
                    }}
                    className={`bg-blue-600 rounded-full p-2 w-full text-white transition duration-200 hover:bg-blue-500 ${
                      (((cheatOrNot || suspend) && cheatId === id) ||
                        !elem?.courseData?.active) &&
                      "opacity-50 cursor-not-allowed"
                    }`}
                  >
                    {(cheatOrNot || suspend) && id === cheatId
                      ? "Suspended"
                      : "Start Quiz"}
                  </Link>

                  <div className="absolute top-2 right-2">
                    {id === "QJe3N4SLsJYDnYk3qSBPnRkiBwt1" && (
                      <div>
                        <Button
                          icon={<EditOutlined />}
                          onClick={() => showModal(elem)}
                          className="mr-2"
                        />
                        <Button
                          icon={<DeleteOutlined />}
                          danger
                          onClick={() => {
                            setId(elem.id);
                            showModal2();
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <h1 className="text-red-500 text-2xl font-bold">
                No Courses Available right now!
              </h1>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
