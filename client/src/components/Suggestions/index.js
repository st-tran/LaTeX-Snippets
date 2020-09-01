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

export default function Suggestions() {
    const [latex, setLatex] = useState("");
    let typingTimer = null;

    return (
        <SuggestionsDiv >
            <h1>Suggest a snippet to be included in the website here.</h1>
            <p>
                The description of the snippet is what users will search for to add the snippet. The
                LaTeX code is what will be rendered.
            </p>
            <p>The snippet will go through approval before it is added to the site.</p>
            <form id="suggform">
                <label>
                    Description:
                    <input type="text" id="fdesc" name="fdesc" minLength={1}/>
                </label>
                <br />
                <label>
                    LaTeX code: <br/>
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
            <button type="submit" form="suggform" value="Submit">
                Submit
            </button>
        </SuggestionsDiv >
    );
}
