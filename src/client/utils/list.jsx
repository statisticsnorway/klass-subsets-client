import React, {useReducer} from 'react';
import '../css/list.css';
import {Trash2} from 'react-feather';


// TODO: show more data on item component (info block, date, etc?)
export const List = ({list}) => {

    return (<ListItems items={list.items.filter(i => i.included)}
                       dispatch={(o) => list.dispatch(o)}/>);
};

export const ListItems = ({items, dispatch}) => {
    return (
        <ul className='list'>
            {items.map((item, i) =>
                <ListItem key={i} item={item} dispatch={dispatch} />)}
        </ul>
    );
};

export const ListItem = ({item, dispatch}) => {
    return (
        <li style={{background: item.dragged ? '#ECFEED' : 'white'}}
            draggable={true}
            onDragOver={() => dispatch({action: 'dragOver', data: item})}
            onDragStart={() => dispatch({action: 'dragged', data: item})}
            onDragEnd={() => dispatch({action: 'dropped', data: item})}
        >
            <div style={{display: 'flex'}}>
                <div style={{width: '400px'}} className='content'
                     onClick={() => dispatch({action: 'toggle_dragged', data: item})}>
                    {item.title}
                </div>

                <Controls item={item} dispatch={dispatch}/>
            </div>
        </li>
    );
};

export const Controls = ({item, dispatch}) => {
    return (
        <span>
            <input type='number' name='rank' style={{width: '4em'}}
                   value={item.rank}
                   onChange={(e) => {
                       dispatch({action: 'rank', data: {item, rank: e.target.value}});
                   }} />

            <button onClick={() => {dispatch({action: 'exclude', data: {item}});}}>
                <Trash2 color='#ED5935'/>
            </button>
    </span>);
};

// FIXME: multiple items (group) dragged and dropped on the start or
//  the end of list fight for the first or the last place -> blink
// Solution: define the order for each item in the group!
function rerank(list) {
    list.forEach((item, i) => item.rank = i + 1);
}

export function reorder(list) {
    list && list.length > 0 && list.sort((a,b) => (a.rank - b.rank));
    rerank(list);
}

export const useList = (list = []) => {

    // in case there be mix of ranked an unranked elements,
    // unranked will appear on top
    list && list.forEach((item) =>
        item && (item.rank = item.rank || 0)
    );
    reorder(list);

    function listReducer(state, {action, data = {}}) {
        switch (action) {
            case 'update': {
                return [...data];
            }
            case 'exclude': {
                data.item.included = false;
                return [...state];
            }
            case 'rank': {
                data.item.rank = data.rank;
                data.rank !== '' && data.rank !== '-' && reorder(state);
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

    return {items, dispatch};
};
