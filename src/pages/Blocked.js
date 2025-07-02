import { Link } from "react-router-dom";

export default function Blocked() {
    return (
        <div className="container">
        <div>
          <h1 className="text-center"><code>You are blocked</code></h1>
          <p>
            <b>Description</b>: You can register another account. Otherwise you cannot see dashboard
          </p>
  
          <Link to={'/login'}>Login</Link> <br />
          <Link to={'/register'}>Register</Link><br />
        </div>
      </div>
    )
}