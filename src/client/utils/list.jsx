import React, {useReducer} from 'react';
import '../css/list.css';
import {Trash2} from 'react-feather';


// TODO: show more data on item component (info block, date, etc?)
export const List = ({list, controls = [
        {name: 'expand', order: -1},
        {name: 'include', order: 2, callback: (i) => console.log('include', i.title)},
    // TODO: extra checkbox to show, that one or multiple items in the lower levels are selected.
    // deactivated if all or none are selected.
        {name: 'draggable'},
        {name: 'rank', order: 1}
    ]
                     }) => {

    return (<ListItems items={list.items.filter(i => i.included)}
                       controls={controls}
                       dispatch={(o) => list.dispatch(o)}/>)
};

export const ListItems = ({controls, items, dispatch}) => {
    return (
        <ul className='list'>
            {items.map((item, i) =>
                <ListItem key={i} item={item} controls={controls} dispatch={dispatch} />)}
        </ul>
    );
};

export const ListItem = ({controls, item, dispatch}) => {
    return (
        <li style={{background: item.dragged ? 'lightblue' : 'white'}}
            className='drag' draggable={!!controls.find(c => c.name === 'draggable') }
            onDragOver={() => dispatch({action: 'dragOver', data: item})}
            onDragStart={() => dispatch({action: 'dragged', data: item})}
            onDragEnd={() => dispatch({action: 'dropped', data: item})}
        >
            <div style={{display: 'flex'}}>

            <Controls
                item={item}
                dispatch={dispatch}
                controls={controls.filter(control => control.order < 0)}
            />

            <div style={{width: '400px'}} className='content'
                  onClick={() => dispatch({action: 'toggle_dragged', data: item})}
            >{item.title}</div>

            <Controls
                item={item}
                dispatch={dispatch}
                controls={controls.filter(control => control.order > 0)}
            />
            {item.expanded && <ListItems items={item.children} controls={controls} dispatch={dispatch} />}

            </div>
        </li>
    );
};

export const Controls = ({item, dispatch, controls}) => {
    return (
        <span>
            {controls.find(c => c.name === 'expand') && item.children && item.children.length > 0 &&
            <button onClick={() => dispatch({action: 'toggle_expand', data: item})}
            >{item.expanded ? <span >&#9652;</span> : <span>&#9662;</span>}
            </button>
            }

            {controls.find(c => c.name === 'rank') &&
            <input type='number' name='rank' style={{width: '4em'}} value={item.rank}
                // FIXME do not returns a number on the 3d level, but text -> list becomes non-sortable!!!
                   onChange={(e) => {
                       dispatch({action: 'rank', data: {item, rank: e.target.value}});
                   }} />
            }

            {controls.find(c => c.name === 'include') &&
            <button onClick={() => {
                item.included = !item.included;
                controls.find(c => c.name === 'include').callback(item);
                dispatch({action: 'toggle_include', data: {item, included: item.included }});
            }}>
                <Trash2 color='#ED5935'/>
                </button>
            }

    </span>);
};

function include(item) {
    item.included = true;
    // check parent -> check all children
    item.children && item.children.filter(i => !i.included).forEach(child => include(child));
    // if all children now included -> check the parent
    item.parent && !item.parent.children.find(i => !i.included) && include(item.parent);
}

function exclude(item) {
    item.included =false;
    // uncheck child -> uncheck parent
    item.parent && exclude(item.parent);
    // uncheck parent: if all children are included -> uncheck everybody
    item.children && !item.children.find(child => !child.included)
    && item.children.forEach(child => exclude(child));
}

function linkParent(item) {
    item && item.children && item.children.forEach(child => child.parent = item);
}

// FIXME: inefficient linking and unlinking on each update -> solution: use Proxy
// FIXME: it's workaround for parent circular structure to JSON. use Proxy or array.find() instead in List
export function unlinkParent(item) {
    if (!item) {return;}
    item.children && item.children.forEach(child => {
        delete child.parent;
        unlinkParent(child);
    });
}

export function rank(item) {
    if (!item) {return;}
    item.rank = item.rank || 0;
    item.children && item.children.forEach(child => rank(child));
}

// FIXME: multiple items (group) dragged and dropped on the start or
//  the end of list fight for the first or the last place -> blink
// Solution: define the order for each item in the group!
function rerank(list) {
    list.forEach((item, i) => item.rank = i + 1);
}

export function reorder(list) {
    list && list.length > 0 && list.sort((a,b) => (b.rank - a.rank));
    rerank(list);
}

export const useList = (list) => {

    // FIXME: it causes traverse fail because of the circular structure to JSON. use Proxy or array.find() instead
    list.length > 0 && list.forEach(item => linkParent(item));
    list.length > 0 && list.forEach((item) => rank(item));
    reorder(list);

    function update(data) {
        dispatch({action: 'update', data});
    }

    function remove(titles) {
        dispatch({action: 'remove', data: titles});
    }

    function listReducer(state, {action, data = {}}) {
        switch (action) {
            case 'update': {
                return [...data];
            }
            case 'remove': {
                return state.filter(item => !data.includes(item.title));
            }
            case 'toggle_expand': {
                data.expanded = !data.expanded;
                return [...state];
            }
            case 'toggle_include': {
                data.included ? include(data.item) : exclude(data.item);
                return [...state];
            }
            case 'rank': {
                data.item.rank = data.rank;
                data.rank !== '' && data.rank !== '-'
                && reorder(data.item.parent ? data.item.parent.children : state);
                return [...state];
            }
            // FIXME: slow on hundreds of items
            case 'dragOver': {
                state.filter(item => item.dragged)
                    .forEach(item => item.rank = data.rank);
                reorder(state);
                return [...state];
            }
            // TODO: item_dragged and item_toggle_dragged are same?
            case 'dragged': {
                data.dragged = true;
                return [...state];
            }
            case 'toggle_dragged': {
                data.dragged = !data.dragged;
                return [...state];
            }
            case 'dropped': {
                state.filter(item => item.dragged)
                    .forEach(item => item.dragged = false);
                return [...state];
            }
            default:
                return state;
        }}

    const [items, dispatch] = useReducer(listReducer, list);

    return {items, dispatch, update, remove};
};
