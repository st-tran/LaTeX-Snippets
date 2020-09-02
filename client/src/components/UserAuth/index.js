import React, { useState } from "react";
import styled from "styled-components";

const AuthDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: space-between;

    form {
        display: flex;
        flex-direction: row;
        justify-content space-between;
    }

    form > label> input {
        margin-left: 16px;
    }

    div {
        margin-top: 32px;
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    div> button:first-child {
        margin-right: 16px;
    }
`;

export default function UserAuth(props) {
    const [error, setError] = useState("");
    const [clicked, setClicked] = useState("");

    return (
        <AuthDiv>
            <h1>Login/Signup</h1>
            <p>
                Login or signup here in order to be able to suggest new snippets, or login under the
                admin account to approve snippets.
            </p>
            <form
                id="loginsignup"
                onSubmit={(e) => {
                    e.preventDefault();
                    fetch(`/${clicked || "login"}`, {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            username: e.target["0"].value,
                            password: e.target["1"].value,
                        }),
                    })
                        .then((res) => {
                            return res.json();
                        })
                        .then((res) => {
                            if (res.message) {
                                setError(res.message);
                            } else {
                                props.setCurrentUser(res.username)
                            }
                        });
                }}>
                <label>
                    Username:
                    <input type="text" id="username" name="username" />
                </label>
                <label>
                    Password:
                    <input type="text" id="password" name="password" />
                </label>
            </form>
            {error.length ? <p>{error}</p> : null}
            <div>
                <button type="submit" form="loginsignup" onClick={() => setClicked("login")}value="Login">
                    Login
                </button>
                <button type="submit" form="loginsignup" onClick={() => setClicked("signup")} value="Signup">
                    Signup
                </button>
            </div>
        </AuthDiv>
    );
}
