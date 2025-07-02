import { Button, Select } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";

export default function Navbar() {
    const { toggleTheme, theme } = useTheme()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const logout = () => {
        localStorage.removeItem('token')
        navigate('/')
    }
    return (
        <div className="container">
            <div className="py-3 d-flex justify-content-between">
                <Link to={'/'}>
                    <img src={"../logo.jpg"} width={200} alt="logo" />
                </Link>
                {console.log(toggleTheme, theme)}
                <div>

                    <Button onClick={toggleTheme} className="mx-2" title="Theme">Theme</Button>
                    <Select defaultValue={'en'}>
                        <Select.Option value="en">En</Select.Option>
                        <Select.Option value="uz">Uz</Select.Option>
                    </Select>
                    {localStorage.getItem('token') ? <Button onClick={logout} className="mx-2">{t('logout')}</Button> :
                        <Button onClick={() => navigate('/login')} className="mx-2" >{t('login')}</Button>
                    }
                </div>
            </div>
        </div>
    )
}