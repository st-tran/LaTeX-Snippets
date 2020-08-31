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
    display: flex;
    flex-direction: column;
`;

export function SearchResult(props) {
    return (
        <Draggable key={props.id} draggableId={props.id} index={props.index}>
            {(provided, snapshot) => (
                <Result
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}>
                    <MathJax.Provider>
                        <MathJax.Node inline formula={props.formula} />
                    </MathJax.Provider>
                </Result>
            )}
        </Draggable>
    );
}

export default function SearchResults(props) {
    return (
        <Droppable droppableId="search-results" direction="horizontal">
            {(provided, snapshot) => (
                <>
                    <ResultsContainer ref={provided.innerRef}>
                        {props.results.map((result, i) => {
                            return <SearchResult
                                key={result.id}
                                id={result.id}
                                index={i}
                                formula={result.equation}
                            />
                        })}
                        {provided.placeholder}
                    </ResultsContainer>
                </>
            )}
        </Droppable>
    );
}
