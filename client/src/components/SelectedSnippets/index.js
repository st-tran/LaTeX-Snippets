import React from "react";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import { SearchResult } from "../SearchResults";

const SelectionWrapper = styled.div`
    min-height: 200px;
    overflow-y: scroll;
    width: 80%;
    margin: 25px;
    border-radius: 25px;
    border: 1px dashed gray;
    ${({ hasItems }) => hasItems && `flex-grow: 1`}
`;

export default function SelectedSnippets(props) {
    return (
        <>
            <Droppable droppableId="selection" direction="vertical">
                {(provided, snapshot) => (
                    <SelectionWrapper ref={provided.innerRef} hasItems={props.selection.length}>
                        {props.selection.map((result, i) => {
                            return (
                                <SearchResult
                                    key={result.id}
                                    id={result.id}
                                    index={i}
                                    formula={result.equation}
                                />
                            );
                        })}
                        {provided.placeholder}
                        <div>
                            {props.selection.map((result, i) => {
                                return <p key={i}>{result.equation}</p>;
                            })}
                        </div>
                    </SelectionWrapper>
                )}
            </Droppable>
        </>
    );
}
