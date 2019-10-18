import React, {useReducer, useEffect} from "react";
import "../css/list.css";

export const List = ({listitems = [],
                         controls = [
                             {name: "expand", order: -1},
                             {name: "include", order: 1, callback: (i) => console.log("include", i.title)}
                         ]}) => {

    const {items, dispatch} = useList(listitems);
    useEffect(() => console.log({ list: items }),[items]);
    useEffect(() => dispatch({action: "update", data: listitems}),[listitems]);

    return (
        <ListItems items={items} controls={controls} dispatch={(o) => dispatch(o)} />
    )
};

export const ListItems = ({controls, items, dispatch}) => {
    return (
        <ul className="list">
            {items.map((item, i) =>
                <ListItem key={i} item={item} controls={controls} dispatch={dispatch} />)}
        </ul>
    )
};

export const ListItem = ({controls, item, dispatch}) => {
    return (
        <li>
            <Controls
                item={item}
                dispatch={dispatch}
                controls={controls.filter(control => control.order < 0)}
            />
            <span>{item.title}</span>
            <Controls
                item={item}
                dispatch={dispatch}
                controls={controls.filter(control => control.order > 0)}
            />
            {item.expanded && <ListItems items={item.children} controls={controls} dispatch={dispatch} />}
        </li>
    )
};

export const Controls = ({item, dispatch, controls}) => {
    return (
        <span>
            {controls.find(c => c.name === "expand") && item.children && item.children.length > 0 &&
            <button onClick={() => dispatch({action: "toggle_expand", data: item})}
            >{item.expanded ? "ᐃ" : "ᐁ"}
            </button>
            }

            {controls.find(c => c.name === "include") &&
            <input type="checkbox" name="include" checked={item.checked}
                   onChange={() => {
                       dispatch({action: "toggle_include", data: item});
                       controls.find(c => c.name === "include").callback(item);
                   }} />
            }
    </span>)
};

function includeAll(item, value) {
    item.checked = value || !item.checked;
    // check parent -> check all children
    item.checked && item.children && item.children.forEach(child => includeAll(child, true));
    // uncheck parent: if all children are checked -> uncheck everybody
    !item.checked && item.children && !item.children.find(child => !child.checked) && item.children.forEach(child => includeAll(child, false));
}

function linkParent(item) {
    item && item.children && item.children.forEach(child => child.parent = item);
}

export const useList = (listitems) => {

    listitems.length > 0 && listitems.forEach(item => linkParent(item));

    function listReducer(state, {action, data = {}}) {
        switch (action) {
            case "update": {
                return [...data];
            }
            case "toggle_expand": {
                data.expanded = !data.expanded;
                return [...state];
            }
            case "toggle_include": {
                includeAll(data);
                return [...state];
            }
            default:
                return state;
        }}

    const [items, dispatch] = useReducer(listReducer, listitems);

    return {items, dispatch};
};