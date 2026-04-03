import React, { useContext, useState } from "react";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Spin, Switch, Upload } from "antd";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "../utils/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { quizCourses } from "../context/courses";

function CourseManage() {
  const { courses, setCourses } = useContext(quizCourses);
  const [form] = Form.useForm(); // Create form instance
  const [loader, setLoader] = useState(false);

  const onFinish = async (values) => {
    try {
      const existOrNot = courses.some(
        (elem) => elem?.courseData?.course === values.course
      );

      if (!existOrNot) {
        // Retrieve the file from the form values
        setLoader(true);
        const iconFile = values.icon[0].originFileObj;

        // Upload the file to Firebase Storage
        const iconRef = ref(
          storage,
          `images/${values.course}/${iconFile.name}`
        );
        await uploadBytes(iconRef, iconFile);

        // Get the download URL of the uploaded file
        const url = await getDownloadURL(iconRef);
        const obj = {
          ...values,
          active: values.active === undefined ? false : values.active,
          icon: url, // Use the uploaded file URL
        };

        // Firestore submission
        const docRef = collection(db, "courses");
        await addDoc(docRef, obj);
        setLoader(false);

        // Update the courses context
        setCourses([...courses, obj]);

        // Show success message
        message.success("Course successfully added!");

        // Reset form fields
        form.resetFields(); // Reset form here
      } else {
        message.error("This course already exists.");
      }
    } catch (error) {
      console.error("Error adding document: ", error);
      message.error("Failed to add course, please try again.");
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <Form
      form={form} // Bind form instance
      name="courses_form"
      className="flex flex-col items-center justify-center p-5 bg-gray-100 shadow-lg rounded-md"
      onFinish={onFinish}
      style={{ maxWidth: 600, margin: "auto" }}
    >
      <h1 className="font-bold text-2xl mb-4">Manage Courses</h1>

      {/* Course Input */}
      <Form.Item
        label="Course"
        name="course"
        className="w-full"
        rules={[{ required: true, message: "Please enter the course!" }]}
      >
        <Input
          placeholder="Enter the course name"
          className="w-full rounded-md"
        />
      </Form.Item>

      {/* Icon Upload */}
      <Form.Item
        label="Icon"
        name="icon"
        className="w-full"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload beforeUpload={() => false} maxCount={1}>
          <Button>Click to Upload Icon</Button>
        </Upload>
      </Form.Item>

      {/* Active Switch */}
      <Form.Item
        label="Active"
        name="active"
        valuePropName="checked"
        className="w-full"
      >
        <Switch
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
        />
      </Form.Item>

      {/* Submit Button */}
      <Form.Item className="mt-2 w-1/2">
        <Button  htmlType="submit" className="w-full rounded-md bg-yellow-500 text-white">
          {loader ? <Spin /> : "Add Course"}
        </Button>
      </Form.Item>
    </Form>
  );
}

export default CourseManage;
