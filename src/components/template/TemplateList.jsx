import axios from "axios";
import { useEffect, useState } from "react";
import { baseurl } from "../../util/baseurl";
import { Button, Card, Dropdown } from "antd";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined, EditOutlined, FileAddOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Typography } from 'antd';

const { Text } = Typography;

export default function TemplateList() {
	const [templist, setTemplist] = useState([]);
	const navigate = useNavigate();
	const { t } = useTranslation();

	useEffect(() => {
		get_templates();
	}, []);

	async function get_templates() {
		const token = localStorage.getItem('token');
		axios({
			method: 'get',
			url: `${baseurl}/api/usertemplates`,
			headers: token ? { Authorization: `Bearer ${token}` } : {},
		})
			.then((res) => {
				setTemplist(res.data.formattedTemplates);
				console.log(res);
			})
			.catch((err) => {
				console.error(err);
				// setTemplist([]);
				// navigate('/login');
			});
	}
	async function delete_template(id) {
		const token = localStorage.getItem('token');
		console.log(id);
		axios({
			method: 'delete',
			url: `${baseurl}/api/templates/${id}`,
			headers: token ? { Authorization: `Bearer ${token}` } : {},
		})
			.then((res) => {
				get_templates();
				console.log(res);
			})
			.catch((err) => {
				console.error(err);
			});
	}

	return (
		<div className="container">
			<div className="d-flex justify-content-end">
				<Button
					type="default"
					variant="outlined"
					onClick={() => navigate('/user/createtemplate')}
					color="primary"
				>
					{t('createTemplate')}
				</Button>
			</div>
			<h1 className="text-center mb-3">{t('myTemplates')}</h1>
			<div className="row">
				{templist.length > 0 &&
					templist.map((item, i) => {
						// Har bir shablon uchun dinamik items massivi
						const items = [
							{
								label: (
									<Text type="secondary">
										<FileAddOutlined /> {t('submit')}
									</Text>
								),
								key: '1',
							},
							{
								label: (
									<Text
										type="success"
										onClick={() => navigate(`/user/edittemplate/${item.id}`)}
									>
										<EditOutlined /> {t('edit')}
									</Text>
								),
								key: '2',
							},
							{
								label: (
									<Text type="danger" onClick={() => delete_template(item.id)}>
										<DeleteOutlined /> {t('delete')}
									</Text>
								),
								key: '3',
							},
						];
						return (
							<Dropdown menu={{ items }} trigger={['contextMenu']} key={item.id}>
								<Card
									title={item?.title}
									titleStyle={{ fontSize: '24px' }}
									className="m-2"
									type="inner"
									hoverable
									variant="borderless"
									style={{ width: 300 }}
								>
									<div dangerouslySetInnerHTML={{ __html: item?.description }} />
								</Card>
							</Dropdown>
						);
					})}
			</div>
		</div>
	);
}