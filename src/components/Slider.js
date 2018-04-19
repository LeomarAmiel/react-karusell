import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import styled, { ThemeProvider } from 'styled-components';
import CarouselItem from './CarouselItem';

const Wrapper = styled.div`
    position: relative;
    width: 500px;
`;

const CarouselWrapper = styled.div`
    position: relative;
    overflow: hidden;
`;

const Carousel = styled.div.attrs({
    style: ({theme}) => ({
        transform: theme.translateValue
    }),
})`
    user-drag: none; 
    user-select: none;
    touch-action: none;
    height: 200px;
    margin: 0;
    padding: 0;    
    display: flex;
    justify-content: flex-start;
    transition: ${props => props.theme.animate 
        ? 'transform .5s ease-out'
        : null
    };
`;

const Button = styled.div`
    background-color: #efefef   ;
    border: 1px solid red;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 40px;
    position: absolute;
    z-index: 5;
`

const LeftButton = Button.extend`
    top: 40%;
    left: 10px;
`;

const RightButton = Button.extend`
    top: 40%;
    right: 10px;
`;

class Slider extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            active: 0,
            translateValue: 0,
            animate: false,
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
        var { active } = this.state; 
        if( active === 0 ) {
            this.handleAnimation( width );
            this.setState({
                width, 
                swipeTreshold: width * 0.3,
                sliderStartPosX: findDOMNode(this).getClientRects()[0].left,
                sliderEndPosX: findDOMNode(this).getClientRects()[0].right,
                translateValue: width,
                animate: false
            });
            return null;
        }
        this.handleAnimation( width * ( active + 1) );
        this.setState({
            width, 
            swipeTreshold: width * 0.3,
            sliderStartPosX: findDOMNode(this).getClientRects()[0].left,
            sliderEndPosX: findDOMNode(this).getClientRects()[0].right,
            translateValue: width * (active + 1),
            animate: false
        });
    }

    checkInfiniteScrolling (active) {
        var { animateStyle, width } = this.state;
        if(active===this.props.onData.length) {
            animateStyle.transform = `translateX(-${width}px)`;
            this.setState({
                active: 0,
                animate: false,
                animateStyle,
                translateValue: width
            });
        } else if ( active === -1 ) {
            animateStyle.transform = `translateX(-${width * (this.props.onData.length) }px)`;
            this.setState({
                active: this.props.onData.length - 1,
                animate: false,
                animateStyle,
                translateValue: width * this.props.onData.length
            });
        }
    }

    forceSwipe(direction) {
        var { active, clickValues, translateValue, width } = this.state;
        
        if(direction === 'right') {
            active = active + 1;
        } else if(direction === 'left') {
            active = active - 1;
        }
        translateValue = width * (active + 1);
        
        clickValues.startPosX = null;
        clickValues.slidePosX = null;
        clickValues.endPosX = null;

        this.handleAnimation(translateValue);
        this.setState({ active, translateValue, clickValues });

        if(this.props.onData.length === active || active === -1 ) {
            setTimeout(() => {
                this.checkInfiniteScrolling(active);
            }, 500)
        }
    }
    
    handleAnimation(value) {
        var { animateStyle } = this.state;
        animateStyle.transform = `translateX(-${value}px)`;
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
            
            if('touches' in e ){
                if( slidePosX!==Math.abs(sliderStartPosX - e.touches[0].clientX) 
                && Math.abs(slidePosX - Math.abs(sliderStartPosX - e.touches[0].clientX))>10){
                    clickValues.slidePosX = Math.abs(sliderStartPosX - e.touches[0].clientX);
                }
            } else {
                if(slidePosX!==Math.abs(sliderStartPosX - e.clientX) 
                && Math.abs(slidePosX - Math.abs(sliderStartPosX - e.clientX))>10){
                    clickValues.slidePosX = Math.abs(sliderStartPosX - e.clientX);
                }
            }
            this.setState({ clickValues, animate: false });
            
            if(startPosX > slidePosX && slidePosX !== null) {
                animationValue = translateValue + Math.abs(startPosX - slidePosX);
            } else if (startPosX < slidePosX && slidePosX !== null) {
                animationValue = translateValue - Math.abs(startPosX - slidePosX);
            }
            this.handleAnimation(animationValue)
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
        var { swipeTreshold } = this.state


        if(Math.abs(startPosX - endPosX) > swipeTreshold){
            if( startPosX > endPosX){
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
        var { onData, onIsLoaded } = this.props; 
        return (
            <Wrapper>
                <ThemeProvider theme={{ translateValue: this.state.animateStyle.transform, animate: this.state.animate }}>
                    <CarouselWrapper>
                        <LeftButton onClick={() => this.forceSwipe('left')}>
                            &#10094;
                        </LeftButton>
                        { onIsLoaded 
                            ? <Carousel
                                onTouchStart={this.handleDragStart}
                                onTouchMove={this.handleDrag}
                                onTouchEnd={this.handleDragEnd}
                                onMouseDown={this.handleDragStart} 
                                onMouseMove={this.handleDrag} 
                                onMouseLeave={this.handleMouseLeave} 
                                onMouseUp={this.handleDragEnd}    
                            >
                                    <CarouselItem onImageSrc={onData[onData.length-1]}/>
                                    {
                                        onData.map((val, index) => 
                                            <CarouselItem key={index} onImageSrc={val}/>
                                        )
                                    }
                                    <CarouselItem onImageSrc={onData[0]}/>
                                </Carousel>
                            : null
                        }
                        <RightButton onClick={() => this.forceSwipe('right')}>
                            &#10095;
                        </RightButton>
                    </CarouselWrapper>
                </ThemeProvider>
            </Wrapper>
        )
    }
}

export default Slider;