import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { baseurl } from "../../util/baseurl";
import axios from "axios";
import { Button, Checkbox, DatePicker, Form, Input, Radio, TimePicker, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";
import { UploadOutlined } from "@ant-design/icons";
import { useTranslation } from 'react-i18next';
import { useTheme } from "../../context/ThemeContext";

export default function Victorina() {
  const { id } = useParams();
  const { t } = useTranslation();
  const theme=useTheme()
  const [victorina, setVictorina] = useState();
  const [template, setTemplate] = useState({ title: '', templateId: id })
  const [form] = Form.useForm(); // Form instansiyasini yaratish
  const style = {
    main: {
      backgroundColor: theme === 'light' ? '#fff' : '#000',
      color: theme === 'light' ? '#000' : '#fff',
    },
    button: {
      backgroundColor: theme === 'light' ? '#fff' : '#000',
      color: theme === 'light' ? '#000' : '#fff',
    }
  }
  useEffect(() => {
    getVictorina();
  }, []);

  function getVictorina() {
    const token = localStorage.getItem("token");
    axios({
      method: "get",
      url: `${baseurl}/api/victorina/${id}`,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => {
        setVictorina(res.data.formattedTemplate);
        setTemplate({ ...template, title: res.data.formattedTemplate.title })
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const postAnswer = (answers) => {
    const token = localStorage.getItem("token");

    axios({
      method: "post",
      url: `${baseurl}/api/answer/create`,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      data: {
        answers,
        template
      }
    }).then((res) => {
      console.log(res.data);
    }).catch((err) => {
      console.log(err);
    })
  }
  const createUploadHandler = (name) => {
    return async ({ file, onSuccess, onError }) => {
      try {
        const formData = new FormData();
        formData.append("upload", file);
        formData.append("fieldName", name); // 👈 name ni ham backendga jo‘natish mumkin

        const res = await axios.post(`${baseurl}/api/uploads`, formData);
        const url = res.data.url;

        onSuccess("ok");

        form.setFieldsValue({
          [name]: url,
        });

        console.log("Uploaded for:", name, "URL:", url);
      } catch (err) {
        console.error("Upload failed for:", name, err);
        onError(err);
      }
    };
  };

  const onchange = (e, type, name) => {
    // `e` bu yerda `DatePicker` yoki `TimePicker` uchun Day.js obyekti, boshqalar uchun event obyekti
    console.log(`${type} changed:`, { name, value: e });
  };

  function renderinput(question) {
    if (question.type === "text") {
      return (
        <Form.Item name={question.name} id={question.id}>
          <Input type="text" onChange={(e) => onchange(e, "text", question.name)} />
        </Form.Item>
      );
    }
    if (question.type === "date") {
      return (
        <Form.Item name={question.name}>
          <DatePicker onChange={(date) => onchange(date, "date", question.name)} format="DD-MM-YYYY" />
        </Form.Item>
      );
    }
    if (question.type === "time") {
      return (
        <Form.Item name={question.name}>
          <TimePicker onChange={(time) => onchange(time, "time", question.name)} format="HH:mm" />
        </Form.Item>
      );
    }
    if (question.type === "file") {
      return (
        // <Form.Item name={question.name}>
        //   <Upload onChange={(e) => onchange(e, "file", question.name)}>
        //     <Button icon={<UploadOutlined />}>Click to Upload</Button>
        //   </Upload>
        // </Form.Item>
        <Form.Item name={question.name}>
          <Upload
            name={question.name}
            customRequest={createUploadHandler(question.name)}
            showUploadList={true} // agar preview kerak bo'lmasa
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>
      );
    }
    if (question.type === "textarea") {
      return (
        <Form.Item name={question.name}>
          <TextArea onChange={(e) => onchange(e, "textarea", question.name)} />
        </Form.Item>
      );
    }
    if (question.type === "radio") {
      return (
        <Form.Item name={question.name}>
          <Radio.Group onChange={(e) => onchange(e, "radio", question.name)}>
            {question.options.map((item, i) => (
              <Radio key={i} value={item.value}>
                {item.value}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
      );
    }
    if (question.type === "checkbox") {
      return (
        <Form.Item name={question.name}>
          <Checkbox.Group onChange={(values) => onchange(values, "checkbox", question.name)}>
            {question.options.map((item, i) => (
              <Checkbox key={i} value={item.value}>
                {item.value}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
      );
    }
  }

  const onFinish = (values, id) => {
    console.log("Received values of form: ", values, id);
    const value = form.getFieldsValue(true);
    console.log("Received values : ", value);

    // Dinamik ravishda DatePicker va TimePicker qiymatlarini formatlash
    const formattedValues = {};
    victorina?.inputs?.forEach((question) => {
      const value = values[question.name];
      if (question.type === "date" && value) {
        formattedValues[question.name] = value.format("DD-MM-YYYY"); // dd-mm-yyyy
      } else if (question.type === "time" && value) {
        formattedValues[question.name] = value.format("HH:mm"); // hh:mm
      } else {
        formattedValues[question.name] = value || null; // boshqa turlarni o‘z holicha saqlash
      }
    });

    console.log("Formatted values:", formattedValues);

    // Objectni arrayga o’tkazish
    const array = Object.entries(formattedValues).map(([key, value]) => ({
      question: key,
      answer: value,
    }));
    postAnswer(array)
    console.log("Formatted values:", array);
  };

  return (
    <div style={style.main}>
      <div className="container py-3">
        {victorina?.length === 0 ? <h1>Loading...</h1> : <h1>{victorina?.title}</h1>}
        <Form form={form} onFinish={onFinish}>
          {victorina?.inputs?.map((question, qIndex) => (
            <div
              key={qIndex}
              style={{ padding: "16px 16px", margin: "10px 0", borderRadius: "15px", border: "1px solid #a1a1a1" }}
            >
              <p className="mb-0 mt-2" style={{ fontSize: "20px" }}>
                {question.name}
              </p>
              <div dangerouslySetInnerHTML={{ __html: question.description }} />
              {renderinput(question)}
            </div>
          ))}
          <Form.Item>
            <Button block type="primary" htmlType="submit">
              {t('send')}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}