import axios from "axios";
import { useEffect, useState } from "react";
import { baseurl } from "../../util/baseurl";
import { Button, Card, Dropdown } from "antd";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined, EditOutlined, FileAddOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Typography } from 'antd';

const { Text } = Typography;

export default function VictorinaList() {
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
			url: `${baseurl}/api/victorina`,
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
		axios({
			method: 'delete',
			url: `${baseurl}/api/usertemplates/${id}`,
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
						return (
							<Card
								key={i}
								title={item?.title}
								titleStyle={{ fontSize: '24px' }}
								className="m-2"
								type="inner"
								hoverable
								onClick={() => navigate(`/victorina/${item.id}`)}
								variant="borderless"
								style={{ width: 300 }}
							>
								<div dangerouslySetInnerHTML={{ __html: item?.description }} />
							</Card>
						);
					})}
			</div>
		</div>
	);
}