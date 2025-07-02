import React, { useState, useEffect } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import { baseurl } from "../../util/baseurl";

const { Title } = Typography;
const { Option } = Select;

const EditTemplate = () => {
	const { t } = useTranslation();
	const theme = useTheme();
	const navigate = useNavigate();
	const { id } = useParams(); // URL'dan shablon ID'sini olish

	const type = [
		{ type: "text", name: t("shortAnswer"), icon: <FileTextOutlined /> },
		{ type: "textarea", name: t("longAnswer"), icon: <FileAddOutlined /> },
		{ type: "file", name: t("file"), icon: <CloudUploadOutlined /> },
		{ type: "date", name: t("date"), icon: <CalendarOutlined /> },
		{ type: "time", name: t("time"), icon: <ClockCircleOutlined /> },
		{ type: "radio", name: t("chooseoneofthem"), icon: <CheckCircleOutlined /> },
		{ type: "checkbox", name: t("multipleChoice"), icon: <UnorderedListOutlined /> },
	];

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		isPublic: true,
	});

	const [questions, setQuestions] = useState([]);

	// Shablon ma'lumotlarini olish
	useEffect(() => {

		fetchTemplate();
	}, [id, t]);
	const fetchTemplate = async () => {
		try {
			const token = localStorage.getItem('token');
			const response = await axios.get(`${baseurl}/api/templates/${id}`, {
				headers: token ? { Authorization: `Bearer ${token}` } : {},
			});
			const { formattedTemplate } = response.data;
			console.log(response);
			// formData'ni to'ldirish
			setFormData({
				title: formattedTemplate.title,
				description: formattedTemplate.description,
				isPublic: formattedTemplate.isPublic,
			});

			// inputs'ni questions'ga aylantirish
			const formattedQuestions = formattedTemplate.inputs.map((input, index) => ({
				id: input.id || Date.now() + index, // Agar id bo'lmasa, vaqtinchalik ID
				name: input.name,
				description: input.description,
				type: input.type,
				required: input.required,
				options: input.options ? input.options.map(opt => opt.value) : [],
				order: input.order,
			}));

			setQuestions(formattedQuestions);
		} catch (error) {
			console.error('Error fetching template:', error);
		}
	};

	const handleFormChange = (e, field) => {
		const value = e && e.target ? e.target.value : e;
		setFormData((prev) => ({
			...prev,
			[field]: field === "isPublic" ? e : value,
		}));
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
			{
				id: Date.now(),
				name: "",
				description: "",
				type: "text",
				required: false,
				options: [],
				order: questions.length + 1,
			},
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
				id: q.id,
				name: q.name,
				description: q.description,
				type: q.type,
				required: q.required,
				order: q.order,
			}));

		const multipleValueInputs = questions
			.filter((q) => ["radio", "checkbox"].includes(q.type))
			.map((q) => ({
				id: q.id,
				name: q.name,
				description: q.description,
				type: q.type,
				required: q.required,
				up: null,
				down: null,
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
				method: 'put',
				url: `${baseurl}/api/templates/${id}`,
				data: payload,
				headers: token ? { Authorization: `Bearer ${token}` } : {},
			});
			console.log("Template updated:", response.data);
			navigate("/user/templatelist");
		} catch (error) {
			console.error("Error updating template:", error);
		}
	};

	return (
		<div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
			<Title level={2} className="text-center">{t("editTemplate")}</Title>
			{
				questions.length == 0 ? <Typography.Text type="success">Loading...</Typography.Text> :
					<>
						<Space direction="vertical" size="middle" style={{ width: "100%", marginBottom: 24 }}>
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
												change_template_info={(value) => handleQuestionChange(qIndex, "description", value)}
											/>
										</div>
										{(question.type === "radio" || question.type === "checkbox") && (
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
					</>
			}


		</div>
	);
};

export default EditTemplate;