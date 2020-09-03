import React, { useEffect, useState } from "react";
import MathJax from "react-mathjax";
import styled from "styled-components";
import Snippet from "../Snippet";

const ManageDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    height: 100%;
    width: 100%;
`;

const SnippetWrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    > span {
        width: 50%;
        height: 30px;
        text-align: center;
        line-height: 30px;
        border-top: 1px solid grey;
        border-bottom: 1px solid grey;
    }

    > div {
        margin-top: 16px;
    }
`;

export default function ManageSnippets(props) {
    const [snippets, setSnippets] = useState([]);
    const [snippetType, setSnippetType] = useState("suggested");

    useEffect(() => {
        fetch(`/snips/${snippetType}`, {
            method: "GET",
            Accept: "application/json",
        })
            .then((res) => {
                if (res.status === 200) {
                    return res.json();
                } else {
                    throw Error("No permission");
                }
            })
            .then((json) => setSnippets(json))
            .catch((err) => console.log(err));
    }, [snippetType]);

    const approveSnippet = (id) => {
        fetch(`/snips/approve/${id}`, {
            method: "PATCH"
        }).then((res) => {
            if (res.status === 200) {
                setSnippets(snippets.filter((snip) => snip._id !== id))
            }
        })
    }

    const deleteSnippet = (id) => {
        fetch(`/snips/delete/${id}`, {
            method: "DELETE"
        }).then((res) => {
            if (res.status === 200) {
                setSnippets(snippets.filter((snip) => snip._id !== id))
            }
        })
    }

    const renderSnippets = () => {
        return snippets.map((snip) => (
            <div key={snip._id}>
                <span>{snip.description}</span>
                <Snippet formula={snip.latex} />
                {snippetType === "suggested" ? (
                    <span
                        onClick={() => {
                            approveSnippet(snip._id);
                        }}>
                        approve
                    </span>
                ) : null}
                <span
                    onClick={() => {
                        deleteSnippet(snip._id);
                    }}>
                    delete
                </span>
            </div>
        ));
    };

    return (
        <ManageDiv>
            <h1>Manage user-submitted snippets here.</h1>
            <p>
                Approved snippets are displayed to everybody. Suggest snippets must be marked as
                approved before they are displayed to everybody.
            </p>
            <SnippetWrapper>
                <span
                    onClick={() => setSnippetType("suggested")}
                    style={{ backgroundColor: snippetType === "suggested" ? "grey" : "white" }}>
                    Suggested
                </span>
                <span
                    onClick={() => setSnippetType("approved")}
                    style={{ backgroundColor: snippetType === "approved" ? "grey" : "white" }}>
                    Approved
                </span>
                <div>{renderSnippets()}</div>
            </SnippetWrapper>
        </ManageDiv>
    );
}
