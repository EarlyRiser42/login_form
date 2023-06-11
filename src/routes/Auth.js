import React, {useState} from 'react';

const Auth = () =>{
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const onChange = (event) => {
        const {
            target: { name, value },
        } = event;
        if (name === "email") {
            setemail(value);
        } else if (name === "password") {
            setpassword(value);
        }
    };
    const onSubmit = (event) => {
        event.preventDefault();
    }
    return(
        <div>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="Email" required value={email} onChange={onChange}/>
                <input type="password" placeholder="Password" required value={password} onChange={onChange}/>
                <input type="submit" value="Login"/>
            </form>
            <button> Continue with google </button>
            <button> Continue with github </button>
        </div>
    )
}

export default Auth