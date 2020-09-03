import React, { useEffect, useState } from "react";
import ReactSearchBox from "react-search-box";
import uuid from "uuid/dist/v4";

export default function Search(props) {
    const [descriptions, setDescriptions] = useState([]);

    useEffect(() => {
        fetch("/snips/descs", {
            method: "GET",
            headers: { Accept: "application/json", "Content-Type": "application/json" },
        })
            .then((res) => res.json())
            .then((json) =>
                setDescriptions(
                    json.map((el) => {
                        return { key: uuid(), value: el };
                    })
                )
            )
            .catch((err) => console.log(err));
    }, []);
    return (
        <ReactSearchBox
            placeholder="Search"
            data={descriptions}
            inputBoxHeight="2em"
            inputBoxBorderColor="gray"
            inputBoxFontColor="black"
            inputBoxFontSize="24px"
            onSelect={(result) => props.update(result.value)}
        />
    );
}
