import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import MathJax from "react-mathjax";
import styled from "styled-components";
import Snippet from "../Snippet";

const ResultsContainer = styled.div`
    width: 100%;
    height: 120px;
    display: flex;
    flex-direction: row;
    overflow-x: scroll;
`;

export default function SearchResults(props) {
    return (
        <Droppable droppableId="search-results" direction="horizontal">
            {(provided, snapshot) => (
                <>
                    <ResultsContainer ref={provided.innerRef}>
                        {props.results.map((result, i) => {
                            return <Draggable key={result.id} draggableId={result.id} index={i}>
                                {(provided, snapshot) => (
                                    <Snippet
                                        draggableIRef={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        formula={result.equation}
                                    />
                                )}
                                </Draggable>
                        })}
                        {provided.placeholder}
                    </ResultsContainer>
                </>
            )}
        </Droppable>
    );
}
