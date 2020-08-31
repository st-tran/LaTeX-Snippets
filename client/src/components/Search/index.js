import React from "react";
import ReactSearchBox from "react-search-box";

export default function Search(props) {
    return (
        <ReactSearchBox
            placeholder="Search"
            data={props.data}
            inputBoxHeight={"16px"}
            onSelect={(result) => {
                props.update(result.value);
            }}
        />
    );
}
