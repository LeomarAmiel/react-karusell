import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import styled from 'styled-components';

const Wrapper = styled.div`
    position: relative;
    width: 500px;
    overflow: hidden;
`;

const Carousel = styled.div`
    display: flex;
    flex-direction: row;
    height: inherit;
    justify-content: flex-start;
`;

const Button = styled.button`
    background-color: rgba(239, 239, 239, .5);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 40px;
    position: absolute;
    z-index: 5;
    top: 40%;
    @media(max-width: 768px){
        top: 30%;
    }
`

const LeftButton = Button.extend`
    left: 10px;
`;

const RightButton = Button.extend`
    right: 10px;
`;

class Slider extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            active: 0,
            translateValue: 0,
            animate: false,
            infinite: props.infinite 
                        ? props.infinite
                        : false,
            dragging: false,
            animateStyle: {
                transform: '',
            },
            clickValues: {
                startPosX: null,
                slidePosX: null,
                endPosX: null,
            },
            sliderStartPosX: null,
            sliderEndPosX: null,
            swipeTreshold: null,
            width: null,
        }
        this.updateDimensions = this.updateDimensions.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDragEnd = this.handleDragEnd.bind(this);
        this.handleFinishDrag = this.handleFinishDrag.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.forceSwipe = this.forceSwipe.bind(this);
        this.checkInfiniteScrolling = this.checkInfiniteScrolling.bind(this);
    }

    componentDidMount () {
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
    }
    
    componentWillUnmount () {
        window.removeEventListener('resize', this.updateDimensions);
    }

    updateDimensions () {
        var width = findDOMNode(this).getBoundingClientRect().width;
        var { active, infinite } = this.state;
        if( infinite === true ){
            if( active === 0 ) {
                this.handleAnimation( -width );
                this.setState({
                    width, 
                    swipeTreshold: width * 0.3,
                    sliderStartPosX: findDOMNode(this).getClientRects()[0].left,
                    sliderEndPosX: findDOMNode(this).getClientRects()[0].right,
                    translateValue: width,
                    animate: false
                });
            } else { 
                this.handleAnimation( -(width * ( active + 1)) );
                this.setState({
                    width, 
                    swipeTreshold: width * 0.3,
                    sliderStartPosX: findDOMNode(this).getClientRects()[0].left,
                    sliderEndPosX: findDOMNode(this).getClientRects()[0].right,
                    translateValue: width * (active + 1),
                    animate: false
                });
            }
        } else {
            this.handleAnimation( - ( width * active ) );
            this.setState({
                width, 
                swipeTreshold: width * 0.3,
                sliderStartPosX: findDOMNode(this).getClientRects()[0].left,
                sliderEndPosX: findDOMNode(this).getClientRects()[0].right,
                translateValue: width * active,
                animate: false
            });
        }
        

    }

    checkInfiniteScrolling (active) {
        var { animateStyle, width } = this.state;
        if(active===this.props.children.length) {
            animateStyle.transform = `translateX(-${width}px)`;
            this.setState({
                active: 0,
                animate: false,
                animateStyle,
                translateValue: width
            });
        } else if ( active === -1 ) {
            animateStyle.transform = `translateX(-${width * (this.props.children.length) }px)`;
            this.setState({
                active: this.props.children.length - 1,
                animate: false,
                animateStyle,
                translateValue: width * this.props.children.length
            });
        }
    }

    forceSwipe(direction) {
        var { active, clickValues, infinite, translateValue, width } = this.state;
        
        if(direction === 'right') {
            active = active + 1;
        } else if(direction === 'left') {
            active = active - 1;
        }

        if (infinite) {
            translateValue = width * (active + 1);
        } else {
            translateValue = width * active;
        }
        
        clickValues.startPosX = null;
        clickValues.slidePosX = null;
        clickValues.endPosX = null;

        this.handleAnimation(-translateValue);
        this.setState({ active, translateValue, clickValues });

        setTimeout(() => {
            this.setState({animate: false});
        }, 400)

        if((this.props.children.length === active && infinite) || (active === -1 && infinite) ) {
            setTimeout(() => {
                this.checkInfiniteScrolling(active);
            }, 500)
        }
    }
    
    handleAnimation(value) {
        var { animateStyle } = this.state;
        animateStyle.transform = `translateX(${value}px)`;
        this.setState({ animateStyle, animate: true });
    }

    handleDragStart(e) {
        var clickValues = {...this.state.clickValues}
        if('touches' in e ){
            clickValues.startPosX = Math.abs(this.state.sliderStartPosX - e.touches[0].clientX);
        } else {
            clickValues.startPosX = Math.abs(this.state.sliderStartPosX - e.clientX);
        }
        this.setState({clickValues, dragging: true})
    }
    
    handleDrag(e) {
        if(this.state.dragging) {
            var clickValues = {...this.state.clickValues}
            var { startPosX, slidePosX } = clickValues;
            var { sliderStartPosX, translateValue } = this.state;
            var animationValue = null;
            if( !this.state.infinite ) {
                animationValue = translateValue;
            }
            
            if('touches' in e && slidePosX===e.clientX ){
                if( slidePosX!==Math.abs(sliderStartPosX - e.touches[0].clientX) 
                && Math.abs(slidePosX - Math.abs(sliderStartPosX - e.touches[0].clientX))>30){
                    clickValues.slidePosX = Math.abs(sliderStartPosX - e.touches[0].clientX);
                }
            } else {
                if(slidePosX!==Math.abs(sliderStartPosX - e.clientX) 
                && Math.abs(slidePosX - Math.abs(sliderStartPosX - e.clientX))>30){
                    clickValues.slidePosX = Math.abs(sliderStartPosX - e.clientX);
                }
            }
            this.setState({ clickValues, animate: false });
            
            if(startPosX > slidePosX && slidePosX !== null ) {
                animationValue = translateValue + Math.abs(startPosX - slidePosX);

            console.log(animationValue);
            } else if (startPosX < slidePosX && slidePosX !== null ) {
                animationValue = translateValue - Math.abs(startPosX - slidePosX);

            console.log(animationValue);
            }
            this.handleAnimation(-animationValue)
        }
    }
    
    handleDragEnd (e) {
        var clickValues = {...this.state.clickValues}
        if('changedTouches' in e ){
            clickValues.endPosX = Math.abs(this.state.sliderStartPosX - e.changedTouches[0].clientX);
        } else {
            clickValues.endPosX = Math.abs(this.state.sliderStartPosX - e.clientX);
        }
        this.setState({clickValues}, 
            this.handleFinishDrag
        );
    }

    handleMouseLeave (e) {
        var clickValues = {...this.state.clickValues};
        var { sliderStartPosX, dragging } = this.state;

        clickValues.endPosX = Math.abs( sliderStartPosX - e.clientX );
        if( clickValues.startPosX!==null && dragging){
            this.setState({clickValues},
                this.handleFinishDrag
            )
        }
    }

    handleFinishDrag () {
        var clickValues = {...this.state.clickValues}
        var { startPosX, endPosX } = clickValues;
        var { active, dragging, infinite, swipeTreshold } = this.state

        if( !infinite && Math.abs(startPosX - endPosX) > swipeTreshold && dragging ) {
            if( startPosX > endPosX ){
                if( active !== this.props.children.length-1 ) {
                    this.forceSwipe('right');
                }
                else {
                    this.forceSwipe(null);
                }
            }
            else {
                if( active !== 0 ) {
                    this.forceSwipe('left');
                } else {
                    this.forceSwipe(null);
                }
            }
        } else if(Math.abs(startPosX - endPosX) > swipeTreshold && dragging){
            if( startPosX > endPosX ){
                this.forceSwipe('right');
            }
            else {
                this.forceSwipe('left');
            }
        } else {
            this.forceSwipe(null);
        }


        this.setState({ dragging: false });
    }

    render() {
        let sliderStyle = {
            transform: this.state.animateStyle.transform,
            transition: this.state.animate 
            ? 'transform .5s ease-out'
            : null
        }
        return (
            <Wrapper>
                <LeftButton onClick={
                    this.state.dragging || this.state.animate || this.props.children === null
                        ? null 
                        : !this.state.infinite && this.state.active===0
                            ? null
                            : () => this.forceSwipe('left')
                    }>
                    &#10094;
                </LeftButton>
                    <Carousel style={sliderStyle}
                        onTouchStart={this.handleDragStart}
                        onTouchMove={this.handleDrag}
                        onTouchEnd={this.handleDragEnd}
                        onMouseDown={this.handleDragStart} 
                        onMouseMove={this.handleDrag} 
                        onMouseLeave={this.handleMouseLeave} 
                        onMouseUp={this.handleDragEnd}    
                    >

                        { this.props.children === null 
                            ? null
                            : this.state.infinite 
                                ? this.props.children[this.props.children.length-1]
                                : null
                        }

                        { this.props.children }
                        { this.props.children === null 
                            ? null
                            : this.state.infinite 
                                ? this.props.children[0]
                                : null
                        }
                    </Carousel>
                <RightButton onClick={
                    this.state.dragging || this.state.animate || this.props.children === null
                        ? null
                        : !this.state.infinite && this.state.active===this.props.children.length-1
                            ? null
                            : () => this.forceSwipe('right')
                }>
                    &#10095;
                </RightButton>
            </Wrapper>
        )
    }
}

export default Slider;