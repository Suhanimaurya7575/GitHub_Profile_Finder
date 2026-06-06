import React from 'react';
import { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import { FaGithub } from "react-icons/fa";

const Login = () => {
    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        email:"",
        password:"",
    });

    const handleChange = (e) =>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value,
        });
    };

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try{
            const response = await API.post(
                "/login",
                formData
            );
            console.log(response.data);

           
                localStorage.setItem(
                    "token",
                    response.data.token
                );
            alert("Login Succussful");
            navigate("/dashboard")

            
        }
        catch(error){
            console.log(error.response?.data);
            alert(
                error.response?.data?.message ||"Login Failed"
            );
            
        }
    };

  return (
    <div className='container'>
        <div className='form-card'>


<div className="github-header">
  <FaGithub className="github-icon" />
  <h1>GitHub Profile Finder</h1>
  <p>Sign in to your account</p>
</div>

        <form onSubmit={handleSubmit}>
            

        

        <input type="email" name="email"
        placeholder='Enter your Email'
        value={formData.email}
        onChange={handleChange}  />
       

        <input type="password"
        name='password'
        placeholder='Enter your password'
        value={formData.password}
        onChange={handleChange} />
       

        <button type='submit'>Login</button>

        <p style={{ textAlign: "center" }}>
  Don't have an account?
  <span
    onClick={() => navigate("/register")}
    style={{
      color: "blue",
      cursor: "pointer",
      marginLeft: "5px"
    }}
  >
    Register
  </span>
</p>

        </form>

        </div>
       
        
    </div>
  );
}

export default Login