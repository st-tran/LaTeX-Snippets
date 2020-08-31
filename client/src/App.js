import React, { useEffect, useState } from "react";
import styled from "styled-components";
import uuid from "uuid/dist/v4";
import { DragDropContext } from "react-beautiful-dnd";
import Search from "./components/Search";
import SearchResults from "./components/SearchResults";
import SelectedSnippets from "./components/SelectedSnippets";
import "./App.css";

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
    left: calc(90% + 16px - 320px);
    width: 320px;
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

const MainTitle = styled.div`
    width: 80%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: ${({ hasItems }) => (hasItems ? `row` : `column`)};
`;

function App() {
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selection, setSelection] = useState([]);

    useEffect(() => {
        fetch(`/snips/${query}`, {
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

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <AppWrapper>
                <UserDiv>
                    <span>suggest a snippet</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="30px"
                        width="10px"
                        preserveAspectRatio="none">
                        <line x1="0" y1="30" x2="10" y2="0" stroke="black" strokeWidth="1px"/>
                    </svg>
                    <span>login/signup</span>
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
        </DragDropContext>
    );
}

export default App;
