import React, { useContext, useEffect, useState } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Select, Spin } from "antd";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../utils/firebase";
import { quizCourses } from "../context/courses";
import { quizSubjects } from "../context/subjectContext";

const ManageQuizApp = () => {
  const { courses } = useContext(quizCourses);
  const [options, setOptions] = useState("");
  const { setSubjects, setCategory, subjectData } = useContext(quizSubjects);
  const [form] = Form.useForm(); // Create form instance
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setCategory(options);
  }, [options]);

  const onFinish = async (values) => {
    try {
      console.log(values);
      setLoader(true);
      const docRef = collection(db, values.subject);
      await addDoc(docRef, values);
      message.success("Question added Successfully")
      setLoader(false);

      console.log("Document added:", values);
      form.resetFields();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <Form
      name="quiz_form"
      className="flex flex-col items-center bg-gray-300 justify-center p-5  shadow-lg rounded-md"
      onFinish={onFinish}
      form={form} // Ensure form instance is passed
      style={{ maxWidth: 600, margin: "auto" }}
    >
      <h1 className="text-2xl mb-4 font-black">Make Quiz</h1>

      {/* Course Input */}
      <Form.Item
        label="Course"
        name="course"
        className="w-full"
        rules={[{ required: true, message: "Please select the course!" }]}
      >
        <Select placeholder="Select the course" onChange={(e) => setOptions(e)}>
          {courses.map((elem) => (
            <Select.Option
              key={elem?.courseData?.course}
              value={elem?.courseData?.course}
            >
              {elem?.courseData?.course}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {/* Subject Input */}
      <Form.Item
        label="Subject"
        name="subject"
        className="w-full"
        rules={[{ required: true, message: "Please select the subject!" }]}
      >
        <Select placeholder="Select the subject">
          {options
            ? subjectData.map((elem) => (
                <Select.Option
                  key={elem?.subjectDetails?.quizName}
                  value={elem?.subjectDetails?.quizName}
                >
                  {elem?.subjectDetails?.quizName}
                </Select.Option>
              ))
            : ""}
        </Select>
      </Form.Item>

      {/* Question Input */}
      <Form.Item
        label="Question"
        name="question"
        className="w-full"
        rules={[{ required: true, message: "Please input the question!" }]}
      >
        <Input
          placeholder="Enter the quiz question"
          className="w-full rounded-md"
        />
      </Form.Item>
      <Form.Item
        label="Answer Description"
        name="description"
        className="w-full"
      >
        <Input
          placeholder="Enter the quiz answer description"
          className="w-full rounded-md"
        />
      </Form.Item>

      {/* Answer Input */}
      <Form.Item
        label="Answer"
        name="answer"
        className="w-full"
        rules={[
          { required: true, message: "Please input the correct answer!" },
        ]}
      >
        <Input
          placeholder="Enter the correct answer"
          className="w-full rounded-md"
        />
      </Form.Item>

      {/* Dynamic Option Fields */}
      <Form.List name="options">
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map(
              (field, index) =>
                index < 4 && (
                  <Form.Item
                    label={`Option ${index + 1}`}
                    required={false}
                    key={field.key}
                    className="w-full"
                  >
                    <Form.Item
                      {...field}
                      validateTrigger={["onChange", "onBlur"]}
                      className="w-full"
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message:
                            "Please input an option or delete this field.",
                        },
                      ]}
                      noStyle
                    >
                      <Input
                        placeholder="Enter option"
                        className="w-full rounded-md"
                      />
                    </Form.Item>
                    {fields.length > 1 ? (
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        onClick={() => remove(field.name)}
                        style={{ margin: "0 8px", color: "#ff4d4f" }}
                      />
                    ) : null}
                  </Form.Item>
                )
            )}
            <Form.Item className="w-1/2 mt-4">
              <Button
                type="dashed"
                onClick={() => add()}
                className="w-full rounded-md"
                icon={<PlusOutlined />}
              >
                Add Option
              </Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>

      {/* Submit Button */}
      <Form.Item className="mt-2 w-1/2">
        <Button type="primary" htmlType="submit" className="w-full rounded-md">
          {loader ? <Spin /> : "Add Question"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ManageQuizApp;
