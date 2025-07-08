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

    const style = {
        main: {
            backgroundColor: theme === 'light' ? '#fff' : '#000',
            color: theme === 'light' ? '#000' : '#fff',
        },
        button: {
            backgroundColor: theme === 'light' ? '#fff' : '#000',
            color: theme === 'light' ? '#000' : '#fff',
        },
        select: {
            backgroundColor: theme == 'dark' ? '#1f1f1f' : '#fff',
            color: theme == 'dark' ? '#fff' : '#000',
            border: theme == 'dark' ? '1px solid #555' : '1px solid #ccc',
            borderRadius: 6,
        },
        option: {
            backgroundColor: theme == 'dark' ? '#2a2a2a' : '#fff',
            color: theme == 'dark' ? '#fff' : '#000',
        },
    }

    return (
        <div style={style.main}>
            <div className="container" >
                <div className="py-3 d-flex justify-content-between">
                    <Link to={'/'}>
                        <img src={"../logo.png"} width={200} alt="logo" />
                    </Link>
                    <div>
                        <Button onClick={toggleTheme} className="mx-2" style={style.button} title="Theme">Theme</Button>
                        <Select defaultValue={'en'} styles={{
                            root: style.select,
                            option: style.option,
                            popup: {
                                root: {
                                    backgroundColor: theme == 'dark' ? '#2a2a2a' : '#fff',
                                    color: theme == 'dark' ? '#fff' : '#000',
                                }
                            }
                        }}
                        >
                            <Select.Option value="en" >En</Select.Option>
                            <Select.Option value="uz">Uz</Select.Option>
                        </Select>
                        {localStorage.getItem('token') ? <Button onClick={logout} style={style.button} className="mx-2">{t('logout')}</Button> :
                            <Button onClick={() => navigate('/login')} style={style.button} className="mx-2" >{t('login')}</Button>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}