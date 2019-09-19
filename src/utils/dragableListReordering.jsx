import React from "react";

// given a mouse event reference, determines whether the current mouse
// position is either aligned with the top or bottom half of the target element
// in order to indicate which top/bottom boundary is closest to mouse's position
// returns: 'string'
const findClosestTargetBoundary = ({target, pageY = 0}) => {
    if(target){
        const boundingRect = target.getBoundingClientRect()
        const offsetY = boundingRect.top + window.scrollY
        const halfPoint = offsetY + boundingRect.height/2
        const isHalfWay = pageY - halfPoint > 0
        return isHalfWay
            ? 'bottom'
            : 'top'
    }
}


// Top-Level container component.
// responsible for passing list props to list components
export default class ReorderView extends React.PureComponent{
    render(){
        const {listData} = this.props
        const listItemComponents = listData.map(
            (item, i) => (
                <ListItem
                    key={`listItem${i}`}
                    render={<ListContent {...item}/>}
                />
            )
        )
        return (
            <section className="lists">
                <OrderList>
                    {listItemComponents}
                </OrderList>
            </section>
        )
    }
}


// List component which manages state of the list based on drag/touch inputs.
// passes along event handlers to individual child list item components.
class OrderList extends React.Component{
    // define initial component state to manage draggable element references within list
    initialState = {
        sourceIndex: false,
        targetBoundary: false,
        targetIndex: false
    }
    // set initial state in component constructor
    constructor(props){
        super(props)
        this.state={
            order: React.Children.map(
                props.children,
                (_,i)=>i),
            ...this.initialState
        }
    }
    // this component should only update during a change of source/touched component,
    // or when the render order has changed
    shouldComponentUpdate(n, m){
        return this.didOrderChange(m.order)
            || this.state.sourceIndex !== m.sourceIndex
    }
    // given an array indicating a new order as a parameter,
    // determine whether or not the order of components has changed.
    // returns a boolean value.
    didOrderChange = newOrder => (
        !newOrder.every(
            i => newOrder[i] === this.state.order[i]
        )
    )
    // helper function to return an array of components as passed into
    // the list component as children. Used to then augment each child with additional props.
    getChildrenAsArray = () => (
        React.Children.map(
            this.props.children,
            child=>child
        )
    )
    // receives an index of the item in the list that is currently being dragged.
    // calculates element boundary by accessing ref el's children, offset by page scroll.
    // ultimately determines where the drop position will be based on which half of
    // the child element the cursor is currently located.
    handleDrag = e => {
        const {sourceIndex, targetIndex, order} = this.state
        // only trigger handler if a drag has been initiated
        if(targetIndex !== false){
            // determine the boundary closest to touch position
            const targetBoundary = findClosestTargetBoundary(e)
            // only set the state if the drop boundary has changed frop top/bottom
            // and source/target indexes are non-equal and explicitly non-false
            if( targetBoundary !== this.state.targetBoundary ){
                this.setState({
                    targetBoundary,
                    order: sourceIndex !== targetIndex !== false
                        ? this.reorderList(
                            sourceIndex,
                            targetIndex,
                            targetBoundary
                        )
                        : order
                })
            }
        }
    }
    // event handler which sets the state of which item index
    // a drag item has most lately entered, updates component state.
    handleDragEnter = index => {
        if(this.state.sourceIndex !== false){
            this.setState({targetIndex: index})
        }
    }
    // once item is released, reset component state
    handleRelease = () => {
        this.setState(this.initialState)
    }
    // during initial touch, determine which element index has been initiated.
    handleTouch = (index, e) => {
        this.setState({sourceIndex: index})
    }
    // reference handle events in an object that is easy to destructure
    // and pass along to children components
    handlers = {
        drag: this.handleDrag,
        enter: this.handleDragEnter,
        release: this.handleRelease,
        touch: this.handleTouch
    }
    // returns an array with index values representing the new render order of the item list.
    // order is determined by which boundary the cursor is closest to within the target element.
    reorderList = (sourceIndex, targetIndex, targetBoundary) => {
        const {order} = this.state
        return order
            .map(
                i => i === targetIndex
                    ? targetBoundary === "bottom"
                        ? [i, sourceIndex]
                        : [sourceIndex, i]
                    : i === sourceIndex
                        ? []
                        : [i]
            )
            .reduce(
                (a = [], item) => a.concat(item)
            )
    }
    render(){
        const {order, sourceIndex, targetIndex} = this.state
        const children = this.getChildrenAsArray()
        const sortedChildren = order.map(
            i => React.cloneElement(
                children[i],
                {
                    ...this.handlers,
                    index: i,
                    touched: sourceIndex === i,
                    swapped: targetIndex === i && sourceIndex !== i
                }
            )
        )
        // this is what is rendered
        return(
            <ul
                className="itemList"
                onMouseUp={this.handlers.release}
                onMouseLeave={this.handlers.release}>
                {sortedChildren}
            </ul>
        )
    }
}


// Component wrapper encapsulating an item within the drag-able list.
class ListItem extends React.Component {
    // set an offsetY state in component to track a transition offset value
    constructor(props){
        super(props)
        this.state = {
            offsetY: 0
        }
    }
    // within the lifecycle event, check to see if this component is either the source or target.
    // if so, set the component state to capture its current Y offset from its bounding rect.
    componentWillReceiveProps(newProps, newState){
        if(
            newProps.swapped ||
            newProps.touched
        ){
            this.setState({
                offsetY: this.el.getBoundingClientRect().top
            })
        }
    }
    // after a component has updated, check to see if it had an offsetY property within its state.
    // if so, re-calculate the components ref element's current offset and set a transforn to
    // negate the delta. Trigger a slight delay to clear the transform to trigger CSS animation.
    componentDidUpdate(nextProps){
        const {offsetY} = this.state
        if(offsetY){
            const {top} = this.el.getBoundingClientRect()
            this.transform(offsetY - top)
            setTimeout(
                ()=>{
                    this.resetTransform()
                    this.setState({offsetY: 0})
                },
                10
            )
        }
    }
    // helper function:
    // Given an offset parameter, set the reference elements style and transition properties.
    transform = offsetY => {
        this.el.style.transform = `translateY(${offsetY}px)`
        this.el.style.transition = 'none'
    }
    // helper function:
    // remove the style attribute from the reference element, reinstating the CSS defined properties.
    resetTransform = () => {
        this.el.removeAttribute('style')
    }
    // render method makes reference to the components root element for future reference to
    // calculate its offset position values for transitioning the component.
    // handlers are mapped to mouse events to trigger reordering as handled by the parent component.
    render(){
        const {touch, drag, enter, release, render} = this.props
        const {index, content, swapped, touched} = this.props
        return(
            <li
                ref={el=>this.el=el}
                className={`item ${touched ? "touched" : ""}`}
                onMouseDown={touch.bind(null, index)}
                onMouseMove={drag}
                onMouseEnter={enter.bind(null, index)}
                onMouseUp={release}>
                {render}
            </li>
        )
    }
}


// Content component within the wrapped ListItem container component.
// passed to the ListItem component via its 'render' prop.
const ListContent = props => {
    return(
        <p className="content">
            {props.content}
        </p>
    )
}