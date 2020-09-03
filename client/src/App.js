import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import styled from "styled-components";
import uuid from "uuid/dist/v4";
import { DragDropContext } from "react-beautiful-dnd";
import Search from "./components/Search";
import SearchResults from "./components/SearchResults";
import SelectedSnippets from "./components/SelectedSnippets";
import Suggestions from "./components/Suggestions";
import ManageSnippets from "./components/ManageSnippets";
import UserAuth from "./components/UserAuth";
import MathJax from "react-mathjax";
import "./App.css";

ReactModal.setAppElement("#root");

const AppWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
`;

const UserDiv = styled.div`
    position: absolute;
    left: calc(90% + 16px);
    width: ${({ currentUser }) => (currentUser === "admin" ? 460 : 320)}px;
    transform: translateX(-100%);
    height: 30px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    border: 1px solid black;
    border-top: 0;
    text-align: center;
    border-bottom-left-radius: 13px;
    border-bottom-right-radius: 13px;

    *:not(svg) {
        flex-grow: 1;
    }

    *:not(svg):hover {
        flex-grow: 2;
    }
`;

const Main = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
    margin-top: 48px;
`;

const Logo = styled.span`
    font-size: 3em;
    font-family: "Latin Modern";
    sub,
    sup {
        text-transform: uppercase;
    }

    sub {
        vertical-align: -0.5ex;
        margin-left: -0.1667em;
        margin-right: -0.125em;
    }

    sup {
        font-size: 0.85em;
        vertical-align: 0.15em;
        margin-left: -0.36em;
        margin-right: -0.15em;
    }
`;

const Popup = styled(function ({ className, modalClassName, ...props }) {
    return (
        <ReactModal
            className={modalClassName}
            portalClassName={className}
            bodyOpenClassName="portalOpen"
            {...props}
        />
    );
}).attrs({
    overlayClassName: "Overlay",
    modalClassName: "Modal",
})`
    & .Overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
        background: rgba(0, 0, 0, 0.8);
    }
    & .Modal {
        position: absolute;
        top: 50%;
        left: 50%;
        right: auto;
        bottom: auto;
        margin-right: -50%;
        height: 50%;
        max-width: 600px;
        padding: 16px;
        border: 1px solid black;
        background-color: white;
        overflow-y: scroll;
        scrollbar-width: none;
        transform: translate(-50%, -50%);
        transition: all 5.3s;
    }
    &[class*="--after-open"] {
    }
    &[class*="--before-close"] {
    }
`;

const MainTitle = styled.div`
    width: 80%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: ${({ hasItems }) => (hasItems ? `row` : `column`)};
`;

const divider = (
    <svg xmlns="http://www.w3.org/2000/svg" height="30px" width="10px" preserveAspectRatio="none">
        <line x1="0" y1="30" x2="10" y2="0" stroke="black" strokeWidth="1px" />
    </svg>
);

export default function App() {
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selection, setSelection] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState("normal");
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        fetch(`/check-session`, {
            method: "GET",
            headers: { Accept: "application/json" },
        }).then((res) => {
            if (res.status === 200) {
                res.json().then((json) => setCurrentUser(json.currentUser));
            }
        });
    }, []);

    useEffect(() => {
        if (query) {
            fetch(`/snips/descs/${query}`, {
                method: "GET",
                headers: { Accept: "application/json", "Content-Type": "application/json" },
            })
                .then((res) => res.json())
                .then((json) =>
                    setSearchResults(
                        json.map((el) => {
                            return { id: uuid(), equation: el.latex };
                        })
                    )
                );
        }
    }, [query]);

    const getDroppableArr = (id) => {
        switch (id) {
            case "search-results":
                return searchResults;
            case "selection":
                return selection;
            default:
                return undefined;
        }
    };

    const onDragEnd = (result) => {
        if (!result.source || !result.destination) {
            return;
        }

        const source = result.source.droppableId;
        const dest = result.destination.droppableId;
        const sourceCon = getDroppableArr(source);
        const destCon = getDroppableArr(dest);

        if (!sourceCon || !destCon) {
            return;
        }

        const [removedEl] = sourceCon.splice(result.source.index, 1);
        destCon.splice(result.destination.index, 0, removedEl);

        if (source === "selection") {
            setSelection([...sourceCon]);
        } else {
            setSearchResults([...sourceCon]);
        }

        if (dest === "selection") {
            setSelection([...destCon]);
        } else {
            setSearchResults([...destCon]);
        }
    };

    const openModal = (type) => {
        setModalOpen(true);
        if (type === "suggestion" || type === "login" || type === "signup" || type === "manage") {
            setModalType(type);
        } else {
            setModalType("");
        }
    };

    const signOut = () => {
        fetch("/logout", {
            method: "POST",
        }).then(() => setCurrentUser(""));
    };

    const renderModal = () => {
        switch (modalType) {
            case "suggestion":
                return (
                    <Suggestions currentUser={currentUser} openLogin={() => openModal("login")} />
                );
            case "login":
                return (
                    <UserAuth
                        setCurrentUser={(user) => {
                            setCurrentUser(user);
                            setModalOpen(false);
                        }}
                    />
                );
            case "manage":
                return <ManageSnippets />;
            default:
                return null;
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <MathJax.Provider>
                <AppWrapper>
                    <Popup isOpen={modalOpen} onRequestClose={() => setModalOpen(false)}>
                        {renderModal()}
                    </Popup>
                    <UserDiv currentUser={currentUser}>
                        <span onClick={() => openModal("suggestion")}>suggest a snippet</span>
                        {divider}
                        {currentUser === "admin" ? (
                            <>
                                <span onClick={() => openModal("manage")}>manage snippets</span>
                                {divider}
                            </>
                        ) : null}
                        {currentUser ? (
                            <span onClick={signOut}>
                                {currentUser} <i className="fas fa-sign-out-alt"></i>
                            </span>
                        ) : (
                            <span onClick={() => openModal("login")}>{"login"}</span>
                        )}
                    </UserDiv>
                    <Main>
                        <MainTitle hasItems={selection.length}>
                            <Logo>
                                L<sup>a</sup>T<sub>e</sub>X Snippets
                            </Logo>
                            <Search update={setQuery} />
                        </MainTitle>
                        <SelectedSnippets selection={selection} />
                    </Main>
                    <SearchResults results={searchResults} />
                </AppWrapper>
            </MathJax.Provider>
        </DragDropContext>
    );
}
