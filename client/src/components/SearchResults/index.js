import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import MathJax from "react-mathjax";
import styled from "styled-components";

const ResultsContainer = styled.div`
    width: 100%;
    height: 120px;
    display: flex;
    flex-direction: row;
    overflow-x: scroll;
`;

const Result = styled.div`
    height: 100%;
    min-width: 20%;
    display: flex;
    flex-direction: column;
`;

export function SearchResult(props) {
    return (
        <Result>
            <MathJax.Provider>
                <MathJax.Node inline formula={props.formula}/>
            </MathJax.Provider>
        </Result>
    );
}

export default function SearchResults(props) {
    return (
        <Droppable droppableId="search-results">
            {(provided, snapshot) => (
                <ResultsContainer ref={provided.innerRef}>
                    {props.results.map((result, i) => (
                        <SearchResult key={i} formula={result} />
                    ))}
                </ResultsContainer>
            )}
        </Droppable>
    );
}
