import axios from "axios";
import { useEffect, useState } from "react";
import { baseurl } from "../../util/baseurl";
import { Button, Card, Dropdown } from "antd";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined, EditOutlined, FileAddOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Typography } from 'antd';
import { useTheme } from "../../context/ThemeContext";

const { Text } = Typography;

export default function VictorinaList() {
	const [templist, setTemplist] = useState([]);
	const navigate = useNavigate();
	const { theme } = useTheme()
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

	return (
		<div style={{ backgroundColor: theme == 'light' ? '#fff' : '#000', height: '100vh', color: theme == 'dark' ? '#fff' : '#000' }}>
			<div className="container">
				<h1 className="text-center mb-3">{t('victorinalist')}</h1>
				<div className="row">
					{templist.length > 0 &&
						templist.map((item, i) => {
							return (
								<Card
									key={i}
									title={item?.title}
									// style={{ backgroundColor: theme == 'light' ? '#fff' : '#000',border:'1px solid white', color: theme == 'dark' ? '#fff' : '#000' }}
									className="m-2"
									hoverable
									onClick={() => navigate(`/victorina/${item.id}`)}
									variant="borderless"
									// style={{ width: 300 }}
								>
									<div dangerouslySetInnerHTML={{ __html: item?.description }} />
								</Card>
							);
						})}
				</div>
			</div>
		</div>
	);
}