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

export default function UserAuth() {
    const [error, setError] = useState("");

    return (
        <AuthDiv>
            <h1>Login/Signup</h1>
            <p>
                Login or signup here in order to be able to suggest new snippets, or login under the
                admin account.
            </p>
            <form id="loginsignup">
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
                <button type="submit" form="loginsignup" formaction="/login" value="Login">
                    Login
                </button>
                <button type="submit" form="loginsignup" formaction="/signup" value="Signup">
                    Signup
                </button>
            </div>
        </AuthDiv>
    );
}
