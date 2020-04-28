import React, {useReducer} from 'react';
import '../css/list.css';
import {Trash2} from 'react-feather';
import {useTranslation} from 'react-i18next';
import '../css/tooltip.css';

// TODO: show more data on item component (info block, date, etc?)
export const List = ({list}) => {
    const { t } = useTranslation();
    return (
        <>
            <div style={{display: 'relative', width: '600px', padding: '5px', position: 'relative'}}>
                <h6 style={{display: 'inline-block', width: '60px', marginBlockEnd: '0'}}>{t('Code')}</h6>
                <h6 style={{display: 'inline', marginBlockEnd: '0'}}>{t('Code name')}</h6>
                <h6 className='rank-text-tooltip tooltip' style={{
                    display: 'inline',
                    position: 'absolute',
                    ariaLabel: 'notifications-label-rank',
                    right: '45px',
                    marginBlockEnd: '0',
                    borderBottom: '1px dotted #274247'
                }}>{t('Rank')}
                <span className="rank-tooltip tooltiptext"  role="tooltip" id='notifications-label-rank'>{t('Code rank tooltip')}</span>
                </h6>
            </div>
            <ul className='list' style={{paddingInlineStart: '0'}}>
                {list.items.filter(i => i.included).map((item, i) =>
                    <ListItem key={i} item={item} dispatch={(o) => list.dispatch(o)} />)}
            </ul>
        </>
    );
};

export const ListItem = ({item, dispatch}) => {
    return (
        <li style={{padding: '5px 0px 5px 8px', display: 'flex', 
                    jusistyContent: 'space-between', maxWidth: '600px',
                    background: item.dragged ? '#B6E8B8' : 'white'
                }}
            draggable={true}
            onDragOver={() => dispatch({action: 'dragOver', data: item})}
            onDragStart={() => dispatch({action: 'dragged', data: item})}
            onDragEnd={() => dispatch({action: 'dropped', data: item})}
        >
            <div style={{width: '65px', marginRight: '10px'}}>{item.code}</div>
            <div style={{width: '100%', marginRight: '5px'}} className='content'
                 onClick={() => dispatch({action: 'toggle_dragged', data: item})}>
                {item.name}
            </div>
            <Controls item={item} dispatch={dispatch}/>
        </li>
    );
};

export const Controls = ({item, dispatch}) => {
    return (
        <span style={{display: 'flex', height: '100%'}}>
            <input type='number' name='rank' style={{textAlign: 'right', width: '35px', marginRight: '5px'}}
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
    list && list.length > 0 && list.sort((a,b) => (a.rank - b.rank -1));
    rerank(list);
}

export const useList = (list = []) => {

    // in case there be mix of ranked an unranked elements,
    // unranked will appear on top
    list && list.forEach((item, i) =>
        item && (item.rank = item.rank || i)
    );
    reorder(list);

    function listReducer(state, {action, data = {}}) {
        switch (action) {
            case 'update': {
                return [...data];
            }
            case 'exclude': {
                data.item.included = false;
                delete data.item.rank;
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
