import React, { useEffect, useState } from "react";
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
            <div className="App">
                <div className="Main">
                    <span className="latex">
                        L<sup>a</sup>T<sub>e</sub>X Snippets
                    </span>
                    <Search
                        data={Object.keys(snippetData).map((v) => {
                            return { key: v, value: v };
                        })}
                        update={setQuery}
                    />
                    <SelectedSnippets selection={selection} />
                </div>
                <SearchResults results={searchResults} />
            </div>
        </DragDropContext>
    );
}

export default App;
