import React, { useState } from "react";
import MathJax from "react-mathjax";
import styled from "styled-components";

const ManageDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;

`;

const SnippetDiv = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    
    span {
        width: 50%;
        height: 30px;
        text-align: center;
    }

    div {
        width: 100%;
        max-height: 50%;
    }
`

export default function ManageSnippets(props) {
    const [snippets, setSnippets] = useState([]);
    const [snippetType, setSnippetType] = useState("suggested");

    return (
        <ManageDiv>
            <h1>Manage user-submitted snippets here.</h1>
            <p>Approved snippets are displayed to everybody. Suggest snippets must be marked as approved before they are displayed to everybody.</p>
            <SnippetDiv>
                <span onClick={() => setSnippetType("suggested")}>Suggested</span>
                <span onClick={() => setSnippetType("approved")}>Approved</span>
                <div>dsa</div>
            </SnippetDiv>
        </ManageDiv>
    );
}
