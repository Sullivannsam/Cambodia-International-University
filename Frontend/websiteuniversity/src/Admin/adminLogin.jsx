
import { useState } from 'react';
export default function adminLogin(){
const [form, setForm] = useState({username: '', password: ''});
return(

  <div className = "flex justify-center p-5">
        
      <div className = "bg-white drop-shadow-lg justify-center items-center gap-5 p-10 rounded-sm" >

        <div className = "flex gap-5">
          <i className = "fa-brands fa-github text-3xl" style={{color: "rgb(0, 0, 0)"}}></i>
          <i className = "fa-brands fa-google text-3xl" style={{color: "rgb(0, 0, 0)"}}></i>
          <i className = "fa-brands fa-apple text-3xl" style={{color: "rgb(0, 0, 0)"}}></i>
        </div>

        <form className = "space-y-10">
          <label for="text">Username or Email </label>
          <input type="Email" 
          name="Email"
          type="Email"
          value={form.email}>

        </form>
      </div>
    
  </div>
  );
}

