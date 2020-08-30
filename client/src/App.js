import React, { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Search from "./components/Search";
import SearchResults from "./components/SearchResults";
import "./App.css";

// Temporary front-end data
const snippetData = {
    "quadratic equation": [
        String.raw`y=ax^2+bx+c\Leftrightarrow x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}`,
        String.raw`y=ax^2+bx+c\Leftrightarrow x=\frac{-b\pm\sqrt{b^2-4ac}}{2abcdsa}`,
    ],
    "test integral": [String.raw`\iint_S\overline f(\bar x)\operatorname{d}x`],
    "": [],
};

function App() {
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        setSearchResults(snippetData[query]);
    }, [query]);

    return (
        <DragDropContext>
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
                </div>
                <SearchResults results={searchResults} />
            </div>
        </DragDropContext>
    );
}

export default App;
