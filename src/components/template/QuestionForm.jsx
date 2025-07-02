import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import {
	Input,
	Select,
	Button,
	Card,
	Checkbox,
	Typography,
	Space,
} from "antd";
import {
	PlusOutlined,
	DeleteOutlined,
	FileTextOutlined,
	FileAddOutlined,
	CloudUploadOutlined,
	CalendarOutlined,
	ClockCircleOutlined,
	CheckCircleOutlined,
	UnorderedListOutlined,
	DragOutlined,
} from "@ant-design/icons";
import { ReactSortable } from "react-sortablejs";
import axios from "axios";
import Editor from "../../util/Editor";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { baseurl } from "../../util/baseurl";

const { Title } = Typography;
const { Option } = Select;

const QuestionForm = () => {
	const { t } = useTranslation()
	const theme = useTheme()
	const navigate = useNavigate()
	const type = [
		{ type: "text", name: `${t("shortAnswer")}`, icon: <FileTextOutlined /> },
		{ type: "textarea", name: `${t("longAnswer")}`, icon: <FileAddOutlined /> },
		{ type: "file", name: `${t("file")}`, icon: <CloudUploadOutlined /> },
		{ type: "date", name: `${t("date")}`, icon: <CalendarOutlined /> },
		{ type: "time", name: `${t("time")}`, icon: <ClockCircleOutlined /> },
		{ type: "radio", name: `${t("chooseoneofthem")}`, icon: <CheckCircleOutlined /> },
		{ type: "checkbox", name: `${t("multipleChoice")}`, icon: <UnorderedListOutlined /> },
	];

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		isPublic: true,
	});

	const [questions, setQuestions] = useState([
		{ id: Date.now(), name: "", description: "", type: "text", required: false, options: [], order: 1 },
	]);

	const handleFormChange = (e, field) => {
		const value = e && e.target ? e.target.value : e;
		setFormData((prev) => ({
			...prev,
			[field]: field === "isPublic" ? e : value,
		}));
		console.log('e, fielad=> ', e, field)
	};

	const handleQuestionChange = (index, field, value) => {
		const newQuestions = [...questions];
		newQuestions[index][field] = value;
		setQuestions(newQuestions);
	};

	const handleAddOption = (index) => {
		const newQuestions = [...questions];
		newQuestions[index].options.push("");
		setQuestions(newQuestions);
	};

	const handleOptionChange = (qIndex, oIndex, value) => {
		const newQuestions = [...questions];
		newQuestions[qIndex].options[oIndex] = value;
		setQuestions(newQuestions);
	};

	const handleDeleteOption = (qIndex, oIndex) => {
		const newQuestions = [...questions];
		newQuestions[qIndex].options.splice(oIndex, 1);
		setQuestions(newQuestions);
	};

	const handleDeleteQuestion = (index) => {
		const newQuestions = [...questions];
		newQuestions.splice(index, 1);
		newQuestions.forEach((q, i) => (q.order = i + 1));
		setQuestions(newQuestions);
	};

	const handleAddQuestion = () => {
		setQuestions([
			...questions,
			{ id: Date.now(), name: "", description: "", type: "text", required: false, options: [], order: questions.length + 1 },
		]);
		window.scrollBy(100, 500);
	};

	const handleSort = (newList) => {
		const updatedQuestions = newList.map((q, index) => ({
			...q,
			order: index + 1,
		}));
		setQuestions(updatedQuestions);
	};

	const handleSubmit = async () => {
		const singleValueInputs = questions
			.filter((q) => ["text", "textarea", "file", "date", "time"].includes(q.type))
			.map((q) => ({
				name: q.name,
				description: q.description,
				type: q.type,
				required: q.required,
				order: q.order,
			}));

		const multipleValueInputs = questions
			.filter((q) => ["radio", "checkbox", "level"].includes(q.type))
			.map((q) => ({
				name: q.name,
				description: q.description,
				type: q.type,
				required: q.required,
				up: q.type === "level" ? 10 : null,
				down: q.type === "level" ? 1 : null,
				options: q.options.map((option) => ({ value: option })),
				order: q.order,
			}));

		const payload = {
			title: formData.title,
			description: formData.description,
			isPublic: formData.isPublic,
			singleValueInputs,
			multipleValueInputs,
		};

		try {
			const token = localStorage.getItem('token');
			const response = await axios({
				method: 'post',
				url: `${baseurl}/api/templates`,
				data: payload,
				headers: token ? { Authorization: `Bearer ${token}`, } : {}
			})
			console.log("Template created:", response.data);
			alert("Template muvaffaqiyatli yaratildi!");
			navigate("/user/templatelist")

		} catch (error) {
			console.error("Error creating template:", error);
			alert("Template yaratishda xatolik yuz berdi.");
		}
	};

	return (
		<div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
			<Title level={2} className="text-center">{t("createTemplate")}</Title>
			<Space direction="vertical" size="middle" style={{ width: "100%", marginBottom: 24 }}>
				{console.log(formData)}
				<Input
					placeholder={t("templateTitle")}
					value={formData.title || ""}
					onChange={(e) => handleFormChange(e, "title")}
					style={{ marginBottom: 16 }}
				/>
				<Editor
					name="description"
					initialData={formData.description || ""}
					change_template_info={handleFormChange}
				/>
				<Checkbox
					checked={formData.isPublic}
					onChange={(e) => handleFormChange(e.target.checked, "isPublic")}
				>
					{t("public")}
				</Checkbox>
			</Space>

			<ReactSortable list={questions} setList={handleSort}>
				{questions.map((question, qIndex) => (
					<Card key={question.id} style={{ marginBottom: 16 }} className="question-card">
						<Space direction="vertical" size="middle" style={{ width: "100%" }}>
							<Space direction="horizontal" size="middle" style={{ width: "100%", alignItems: "center" }}>
								<DragOutlined style={{ cursor: "move" }} />
								<Input
									placeholder={t("question")}
									value={question.name || ""}
									onChange={(e) => handleQuestionChange(qIndex, "name", e.target.value)}
									style={{ flex: 1 }}
								/>
								<Select
									value={question.type || "text"}
									onChange={(value) => handleQuestionChange(qIndex, "type", value)}
									style={{ minWidth: 200 }}
								>
									{type.map((item) => (
										<Option key={item.type} value={item.type}>
											{item.icon}
											<span style={{ marginLeft: 8 }}>{item.name}</span>
										</Option>
									))}
								</Select>
								<Checkbox
									checked={question.required}
									onChange={(e) => handleQuestionChange(qIndex, "required", e.target.checked)}
								>
									{t("mondatory")}
								</Checkbox>
								<Button
									type="text"
									danger
									icon={<DeleteOutlined />}
									onClick={() => handleDeleteQuestion(qIndex)}
								/>
							</Space>
							<div style={{ width: "100%" }}>
								<Editor
									name="description"
									initialData={question.description || ""}
									change_template_info={(e) => handleQuestionChange(qIndex, "description", e.target.value)}
								/>
							</div>
							{(question.type === "radio" || question.type === "checkbox" || question.type === "level") && (
								<div style={{ marginTop: 16 }}>
									{question.options.map((option, oIndex) => (
										<Space key={oIndex} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
											<Input
												placeholder={`Variant ${oIndex + 1}`}
												value={option}
												onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
												style={{ width: 300 }}
											/>
											<Button
												type="text"
												danger
												icon={<DeleteOutlined />}
												onClick={() => handleDeleteOption(qIndex, oIndex)}
											/>
										</Space>
									))}
									<Button
										type="dashed"
										icon={<PlusOutlined />}
										onClick={() => handleAddOption(qIndex)}
										style={{ marginTop: 8 }}
									>
										{t("addOption")}
									</Button>
								</div>
							)}
						</Space>
					</Card>
				))}
			</ReactSortable>

			<Space style={{ marginTop: 16, width: "100%", justifyContent: "space-between" }}>
				<Button type="primary" icon={<PlusOutlined />} onClick={handleAddQuestion}>
					{t("addQuestion")}
				</Button>
				<Button type="primary" style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }} onClick={handleSubmit}>
					{t("saveTemplate")}
				</Button>
			</Space>
		</div>
	);
};

export default QuestionForm;