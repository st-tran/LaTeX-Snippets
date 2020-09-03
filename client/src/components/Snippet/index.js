import React from "react";
import MathJax from "react-mathjax";
import styled from "styled-components";

const SnippetDiv = styled.div`
    display: flex;
    flex-direction: column;
`;

export default class Snippet extends React.Component {
    render() {
        return (
            <SnippetDiv ref={this.props.draggableIRef} {...this.props}>
                <MathJax.Node formula={this.props.formula} />
            </SnippetDiv>
        );
    }
}

