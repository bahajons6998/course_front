import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Home() {
  const { theme } = useTheme()
  return (
    <div style={{ backgroundColor: theme == 'light' ? '#fff' : '#000',height:'100vh', color: theme == 'dark' ? '#fff' : '#000' }}>
      <div className="container">
        <div>
          <h1 className="text-center"><code>Welcome to my course project!</code></h1>
          <p>
            <b>Description</b>: You can login and register using this website. You
            can also view all the users and their details. If you are blocked you
            can't see dashboard.
            You can also block or unblock and delete users. You can logout and relogin again.
          </p>

          <Link to={'/login'}>Login</Link> <br />
          <Link to={'/register'}>Register</Link><br />
          <Link to={'/user/templatelist'}>TemplateList</Link><br />
          <Link to={'/user/createtemplate'}>Createtemplate</Link><br />
          <Link to={'/dashboard'}>Dashboard</Link><br />
          <Link to={'/victorinalist'}>Victorina</Link><br />
        </div>
      </div>
    </div>
  );
}