import React, { useState } from "react";
import MathJax from "react-mathjax";
import styled from "styled-components";

const SuggestionsDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;

    form {
        display: flex;
        flex-direction: column;
        justify-content: stretch;
        align-items: stretch;
    }

    form > label {
        display: flex;
        align-items: center;
    }

    form > input {
        margin-top: 8px;
    }

    form > label > input {
        margin-left: 16px;
        flex-grow: 1;
    }

    button {
        margin-top: 8px;
    }
`;

const submitSuggestion = (e, setLatex, setStatus) => {
    e.preventDefault();
    e.persist();

    fetch("/snips", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            description: e.target["0"].value,
            latex: e.target["1"].value,
        }),
    }).then((res) => {
        if (res.status === 200) {
            e.target.reset();
            setLatex("");
            setStatus("");
        } else {
            return res.text().then((res) => setStatus(res));
        }
    });
};

export default function Suggestions(props) {
    const [latex, setLatex] = useState("");
    const [status, setStatus] = useState("");
    let typingTimer = null;

    return (
        <SuggestionsDiv>
            {props.currentUser ? (
                <>
            <h1>Suggest a snippet to be included in the website here.</h1>
            <p>
                The description of the snippet is what users will search for to add the snippet. The
                LaTeX code is what will be rendered.
            </p>
            <p>The snippet will go through approval before it is added to the site.</p>
            <form id="suggform" onSubmit={(e) => submitSuggestion(e, setLatex, setStatus)}>
                <label>
                    Description:
                    <input
                        type="text"
                        id="fdesc"
                        name="fdesc"
                        minLength={1}
                        onChange={() => {
                            if (status) {
                                setStatus("");
                            }
                        }}
                    />
                </label>
                <br />
                <label>
                    LaTeX code: <br />
                </label>
                <input
                    type="text"
                    id="flatex"
                    name="flatex"
                    onChange={(e) => {
                        const val = e.target.value;
                        clearTimeout(typingTimer);
                        typingTimer = setTimeout(() => {
                            if (val) {
                                setLatex(val);
                                if (status) {
                                    setStatus("");
                                }
                            }
                        }, 200);
                    }}
                    minLength={1}
                />
            </form>
            <p>Preview:</p>
            <MathJax.Provider>
                <MathJax.Node formula={latex} />
            </MathJax.Provider>
            {status.length ? <p>{status}</p> : null}
            <button type="submit" form="suggform" value="Submit">
                Submit
            </button>
                </>
            ) : (
                <>
                    <h1>You must login to suggest snippets.</h1>
                    <p onClick={props.openLogin}>Click here to login.</p>
                </>
            )}
        </SuggestionsDiv>
    );
}
