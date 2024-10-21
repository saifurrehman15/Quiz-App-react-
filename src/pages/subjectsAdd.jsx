import React, { useContext, useState } from "react";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Select, Spin, Switch, Upload } from "antd";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "../utils/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { quizCourses } from "../context/courses";

function AddSubject() {
  const { courses, setCourses } = useContext(quizCourses);
  const [form] = Form.useForm();
  const [loader, setLoader] = useState(false);

  const onFinish = async (values) => {
    try {
      // const iconFile = values.icon[0].originFileObj;

      // const iconRef = ref(
      //   storage,
      //   `images/${values.course}/${iconFile.name}`
      // );
      // await uploadBytes(iconRef, iconFile);

      // const url = await getDownloadURL(iconRef);
      const obj = {
        ...values,
        active: values.active === undefined ? false : values.active,
      };
      setLoader(true);
      const docRef = collection(db, values.course);
      await addDoc(docRef, obj);
      setLoader(false);

      // setCourses([...courses, obj]);

      message.success("Subject successfully added!");

      // Reset form fields
      form.resetFields(); // Reset form here
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
      <h1 className="font-bold text-2xl mb-4">Manage Subjects</h1>

      {/* Course Input */}
      {/* <Form.Item
        label="Course"
        name="course"
        className="w-full"
        rules={[{ required: true, message: "Please enter the course!" }]}
      >
        <Input
          placeholder="Enter the course name"
          className="w-full rounded-md"
        />
      </Form.Item> */}
      <Form.Item
        label="Course"
        name="course"
        className="w-full"
        rules={[{ required: true, message: "Please select the course!" }]}
      >
        <Select placeholder="Select the course">
          {courses.map((elem) => (
            <Select.Option value={elem?.courseData?.course}>
              {elem?.courseData?.course}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Quiz Name"
        name="quizName"
        className="w-full"
        rules={[{ required: true, message: "Please input the Quiz Name!" }]}
      >
        <Input
          placeholder="Enter the quiz Name"
          className="w-full rounded-md"
        />
      </Form.Item>

      {/* Active Switch */}
      <Form.Item
        label="Subject"
        name="subject"
        className="w-full"
        rules={[{ required: true, message: "Please input the subject!" }]}
      >
        <Input
          placeholder="Enter the quiz subject"
          className="w-full rounded-md"
        />
      </Form.Item>

      <Form.Item
        label="Quiz Key"
        name="key"
        className="w-full"
        rules={[{ required: true, message: "Please input the key!" }]}
      >
        <Input placeholder="Enter the quiz key" className="w-full rounded-md" />
      </Form.Item>

      <Form.Item
        label="Total Time"
        name="totalTime"
        className="w-full"
        rules={[{ required: true, message: "Please input the total time!" }]}
      >
        <Input
          placeholder="Enter the quiz total time"
          className="w-full rounded-md"
        />
      </Form.Item>
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
        <Button type="primary" htmlType="submit" className="w-full rounded-md">
          {loader ? <Spin /> : "Add Subject"}
        </Button>
      </Form.Item>
    </Form>
  );
}

export default AddSubject;
