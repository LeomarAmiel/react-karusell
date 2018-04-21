import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import styled from 'styled-components';
import Button from './Button';
import Indicator from './Indicator';

const Wrapper = styled.div`
    position: relative;
    width: inherit;
    overflow: hidden;
`;

const Carousel = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    height: inherit;
    position: relative;
    touch-action: none;
    user-select: none;
    user-drag: none;
`;

const LeftButtonWrapper = styled.div`
    position: absolute;
    z-index: 5;
    top: 40%;
    left: 10px;
    @media(max-width: 768px){
        top: 30%;
    }
`;

const RightButtonWrapper = styled.div`
    position: absolute;
    z-index: 5;
    top: 40%;
    right: 10px;
    @media(max-width: 768px){
        top: 30%;
    }
`;

class Slider extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            active: 0,
            translateValue: 0,
            animate: false,
            autoplay: props.autoplay 
                ? props.autoplay
                : false,
            autoplaySpeed: props.autoplaySpeed 
                ? Number.isInteger(props.autoplaySpeed) 
                    ? props.autoplaySpeed
                    : 3000
                : null,
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
            intervalId: null,
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
        this.goToSlide = this.goToSlide.bind(this);
        this.checkInfiniteScrolling = this.checkInfiniteScrolling.bind(this);
        this.setAutoPlayInterval = this.setAutoPlayInterval.bind(this);
    }

    componentDidMount () {
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
        this.setAutoPlayInterval();

    }

    setAutoPlayInterval () {
        if(this.state.autoplay){
            var intervalId = setInterval(() => {
                if(!this.state.dragging && this.props.children !== null ){
                    if(this.props.children.length-1 === this.state.active && this.state.infinite!==true){
                        this.goToSlide(0)
                    } else {
                        this.forceSwipe('right');
                    }
                }
            }, this.state.autoplaySpeed);
            this.setState({intervalId});
        }
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
        var { active, autoplay, clickValues, infinite, intervalId, translateValue, width } = this.state;

        if (autoplay) {
            clearInterval(intervalId);
            this.setState({intervalId: null});
        }

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
        if(autoplay){
            this.setAutoPlayInterval();
        }
    }
    
    goToSlide(key) {
        var { infinite, width } = this.state;
        if( infinite ) {
            this.setState({active: key, translateValue: width * (key + 1)});
            this.handleAnimation( -(width * ( key + 1 )));
        } else {
            this.setState({active: key, translateValue: width * key});
            this.handleAnimation( -(width * key));
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
            if( this.state.infinite ) {
                animationValue = translateValue;
            }
            
            if('touches' in e){
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
            } else if (startPosX < slidePosX && slidePosX !== null ) {
                animationValue = translateValue - Math.abs(startPosX - slidePosX);
            } else {
                animationValue = translateValue;
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
                <LeftButtonWrapper>
                    <Button onClick={
                        this.state.dragging || this.state.animate || this.props.children === null
                            ? null 
                            : !this.state.infinite && this.state.active===0
                                ? null
                                : () => this.forceSwipe('left')
                        }>
                        &#10094;
                    </Button>
                </LeftButtonWrapper>
                
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

                <RightButtonWrapper>
                    <Button onClick={
                        this.state.dragging || this.state.animate || this.props.children === null
                            ? null
                            : !this.state.infinite && this.state.active===this.props.children.length-1
                                ? null
                                : () => this.forceSwipe('right')
                    }>
                        &#10095;
                    </Button>
                </RightButtonWrapper>
                <Indicator onActive={this.state.active}
                    onHandleClick={this.goToSlide}
                    onCount = { this.props.children === null 
                        ? null 
                        : this.props.children.length}
                    
                    />
            </Wrapper>
        )
    }
}

export default Slider;