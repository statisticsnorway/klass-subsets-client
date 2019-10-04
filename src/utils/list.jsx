import React, {useState, useEffect} from "react";
import "../css/list.css";

export const List = ({listitems = [],
                         controls = {
                             expand: {before: true},
                             include: {after: true,
                                 callback: (i) => console.log("include", i.title)}}
                     }) => {
    console.log("reload List");
    const [items, setItems] = useState(listitems);
    useEffect(() => console.log({ list: items }),[items]);
    useEffect(() => setItems(listitems),[listitems]);

    return (
        <ul className="list">
            {items.map((item, i) =>
                <ListItem key={i} item={item} controls={controls} setItems={()=> setItems([...items])} />)}
        </ul>
    )
};

export const ListItem = ({controls, item, setItems}) => {

    function filterControls(property) {
        return Object.keys(controls).reduce((p, c) => {
            if (controls[c][property]) p[c] = controls[c];
            return p;
        }, {})
    }

    return (
        <li>
            <Controls
                item={item}
                setItems={(i)=> setItems(i)}
                controls={filterControls("before")}
            />
            <span>{item.title}</span>
            <Controls
                item={item}
                setItems={(i)=> setItems(i)}
                controls={filterControls("after")}
            />
            {item.expanded && <List listitems={item.children} controls={controls} />}
        </li>
    )
};

export const Controls = ({item, setItems, controls}) => {
    return (
        <span>
            {controls.expand && item.children && item.children.length > 0 &&
            <button onClick={() => {
                item.expanded = !item.expanded;
                setItems();}}>
                {item.expanded ? "ᐃ" : "ᐁ"}
            </button>
            }

            {controls.include &&
            <input type="checkbox" name="include" checked={item.checked}
                   onChange={() => {
                       item.checked = !item.checked;
                       setItems();
                       controls.include.callback(item);
                   }} />
            }
    </span>)
};
