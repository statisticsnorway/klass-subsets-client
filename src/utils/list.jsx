import React, {useReducer} from "react";
import "../css/list.css";

export const List = ({list, controls = [
                             {name: "expand", order: -1},
                             {name: "include", order: 1, callback: (i) => console.log("include", i.title)}
                         ]}) => {

    return (<ListItems items={list.items}
                       controls={controls}
                       dispatch={(o) => list.dispatch(o)} />)
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

function unlinkParent(item) {
    item.children.forEach(child => delete child.parent);
}

export const useList = (list) => {

    // FIXME: it causes traverse fail because of the circular structure to JSON. use Proxy or array.find() instead
    list.length > 0 && list.forEach(item => linkParent(item));

    function update(data) {
        dispatch({ action: "update", data: data });
    }

    function getItems() {
        return items.forEach(code => unlinkParent(code));
    }

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

    const [items, dispatch] = useReducer(listReducer, list);

    return {items, dispatch, update, getItems};
};