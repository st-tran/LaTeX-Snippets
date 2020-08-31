import React, { useEffect, useState } from "react";
import styled from "styled-components";
import uuid from "uuid/dist/v4";
import { DragDropContext } from "react-beautiful-dnd";
import Search from "./components/Search";
import SearchResults from "./components/SearchResults";
import SelectedSnippets from "./components/SelectedSnippets";
import "./App.css";

// Temporary front-end data
const snippetData = {
    "quadratic equation": [
        String.raw`y=ax^2+bx+c\Leftrightarrow x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}`,
        String.raw`y=ax^2+bx+c\Leftrightarrow x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}`,
        String.raw`y=ax^2+bx+c\Leftrightarrow x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}`,
        String.raw`y=ax^2+bx+c\Leftrightarrow x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}`,
        String.raw`y=ax^2+bx+c\Leftrightarrow x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}`,
        String.raw`y=ax^2+bx+c\Leftrightarrow x=\frac{-b\pm\sqrt{b^2-4ac}}{2abcdsa}`,
        String.raw`y=ax^2+bx+c\Leftrightarrow x=\frac{-b\pm\sqrt{b^2-4ac}}{2abcdsa}`,
        String.raw`y=ax^2+bx+c\Leftrightarrow x=\frac{-b\pm\sqrt{b^2-4ac}}{2abcdsa}`,
        String.raw`y=ax^2+bx+c\Leftrightarrow x=\frac{-b\pm\sqrt{b^2-4ac}}{2abcdsa}`,
        String.raw`y=ax^2+bx+c\Leftrightarrow x=\frac{-b\pm\sqrt{b^2-4ac}}{2abcdsa}`,
    ],
    "test integral": [String.raw`\iint_S\overline f(\bar x)\operatorname{d}x`],
    "": [],
};

const AppWrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
`;
const Main = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
    margin-top: 32px;
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
    flex-direction: ${({hasItems}) => hasItems ? `row` : `column`};
`

function App() {
    const [query, setQuery] = useState("quadratic equation");
    const [searchResults, setSearchResults] = useState([]);
    const [selection, setSelection] = useState([]);

    useEffect(() => {
        setSearchResults(
            snippetData[query].map((equation) => {
                return {
                    id: uuid(),
                    equation: equation,
                };
            })
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
                <Main>
                    <MainTitle hasItems={selection.length}>
                        <Logo>
                            L<sup>a</sup>T<sub>e</sub>X Snippets
                        </Logo>
                        <Search
                            data={Object.keys(snippetData).map((v) => {
                                return { key: v, value: v };
                            })}
                            update={setQuery}
                        />
                    </MainTitle>
                    <SelectedSnippets selection={selection} />
                </Main>
                <SearchResults results={searchResults} />
            </AppWrapper>
        </DragDropContext>
    );
}

export default App;
