import React from "react";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import { SearchResult } from "../SearchResults";

const SelectionWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    min-height: 200px;
    width: 80%;
    margin: 25px;
    border-radius: 25px;
    scrollbar-width: none;
    padding: 16px;
    ${({ hasItems }) => (hasItems ? `border: 1px solid black;` : `border: 1px dashed gray;`)}
    ${({ hasItems }) => hasItems && `overflow-y: scroll;`}
    ${({ hasItems }) => hasItems && `flex-grow: 1;`}
`;
const SelectedSnippetsWrapper = styled.div`
    text-align: center;
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    height: 100%;
`;

const SelectedCodeWrapper = styled.code`
    padding-left: 16px;
    white-space: pre-line;
    height: 100%;
`;

export default function SelectedSnippets(props) {
    return (
        <SelectionWrapper hasItems={props.selection.length}>
            <Droppable droppableId="selection" direction="vertical">
                {(provided, snapshot) => (
                    <SelectedSnippetsWrapper ref={provided.innerRef}>
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
                        {props.selection.length ? null : <p style={{ margin: "auto" }}>Drag and drop snippets here!</p>}
                        {provided.placeholder}
                    </SelectedSnippetsWrapper>
                )}
            </Droppable>
            {props.selection.length ? (
                <SelectedCodeWrapper>
                    {props.selection.map((result) => {
                        return `${result.equation}\n`;
                    })}
                </SelectedCodeWrapper>
            ) : null}
        </SelectionWrapper>
    );
}
