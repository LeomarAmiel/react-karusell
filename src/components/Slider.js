import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import styled, { ThemeProvider } from 'styled-components';
import CarouselItem from './CarouselItem';

const Wrapper = styled.div`
    position: relative;
    width: 500px;
    overflow: hidden;
`;

const Carousel = styled.div.attrs({
    style: ({theme}) => ({
        transform: theme.translateValue
    }),
})`
    margin: 0;
    padding: 0;    
    display: flex;
    justify-content: flex-start;
    transition: transform .5s ease-out;
`;

class Slider extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            active: 0,
            sliderStartPosX: null,
            sliderEndPosX: null,
            translateValue: 0,
            dragging: false,
            swipeTreshold: null,
            width: null,
            animateStyle: {
                transform: '',
            },
            clickValues: {
                startPosX: null,
                slidePosX: null,
                endPosX: null,
            }
        }
        this.updateDimensions = this.updateDimensions.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDragEnd = this.handleDragEnd.bind(this);
        this.handleFinishDrag = this.handleFinishDrag.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
    }

    updateDimensions () {
        var animateStyle = this.state.animateStyle;
        animateStyle.transform = `translateX(-${this.state.translateValue}px)`
        this.setState({
            width: findDOMNode(this).getBoundingClientRect().width, 
            swipeTreshold: (findDOMNode(this).getBoundingClientRect().width * 0.3),
            sliderStartPosX: findDOMNode(this).getClientRects()[0].left,
            sliderEndPosX: findDOMNode(this).getClientRects()[0].right,
        });
    }

    componentDidMount () {
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
    }
    
    componentWillUnmount () {
        window.removeEventListener('resize', this.updateDimensions);
    }


    handleDragStart(e) {
        var clickValues = {...this.state.clickValues}
        clickValues.startPosX = Math.abs(this.state.sliderStartPosX - e.clientX);
        this.setState({clickValues, dragging: true})
    }
    
    handleDrag(e) {
        // Should rely more on the clickStartPos
        if(this.state.dragging) {

            if(this.state.clickValues.slidePosX!==Math.abs(this.state.sliderStartPosX - e.clientX) 
            && Math.abs(this.state.clickValues.slidePosX - Math.abs(this.state.sliderStartPosX - e.clientX))>10){
                var clickValues = {...this.state.clickValues}
                clickValues.slidePosX = Math.abs(this.state.sliderStartPosX - e.clientX);
                this.setState({clickValues});
            }
            var animateStyle = this.state.animateStyle;
            if(this.state.clickValues.startPosX > this.state.clickValues.slidePosX && this.state.clickValues.slidePosX !== null) {
                animateStyle.transform = `translateX(-${this.state.translateValue + Math.abs(this.state.width - this.state.clickValues.slidePosX)}px)`;
                this.setState({animateStyle});
            } else if (this.state.clickValues.startPosX < this.state.clickValues.slidePosX) {
                animateStyle.transform = `translateX(-${this.state.translateValue - Math.abs(this.state.clickValues.slidePosX)}px)`;
                this.setState({animateStyle});
            }

        }
    }
    
    handleDragEnd (e) {

        var clickValues = {...this.state.clickValues}
        clickValues.endPosX = Math.abs(this.state.sliderStartPosX - e.clientX);
        this.setState({clickValues, dragging: false}, 
            this.handleFinishDrag
        );
    }

    handleMouseLeave (e) {
        var clickValues = {...this.state.clickValues}
        clickValues.endPosX = Math.abs(this.state.sliderStartPosX - e.clientX);
        if(this.state.clickValues.startPosX!==null&&this.state.dragging){
            this.setState({clickValues, dragging: false},
                this.handleFinishDrag
            )
        }
    }

    handleFinishDrag () {
        if(Math.abs(this.state.clickValues.startPosX-this.state.clickValues.endPosX)>this.state.swipeTreshold){
            var animateStyle = this.state.animateStyle;
            if(this.state.clickValues.startPosX > this.state.clickValues.endPosX){
                animateStyle.transform = `translateX(-${ this.state.width * (this.state.active + 1) }px)`;
                this.setState({ active: this.state.active + 1, animateStyle, translateValue: this.state.width * (this.state.active + 1 ) })
            }
            else {
                animateStyle.transform = `translateX(-${ this.state.width * (this.state.active - 1) }px)`;
                this.setState({ active: this.state.active - 1, animateStyle, translateValue: this.state.width * (this.state.active - 1 ) })
            }
        }
        var clickValues = this.state.clickValues;
        clickValues.startPosX = null;
        clickValues.slidePosX = null;
        clickValues.endPosX = null;
        this.setState({clickValues});
    }

    render() {
        return (
            <Wrapper>
                <ThemeProvider theme={{ translateValue: this.state.animateStyle.transform}}>
                    { 
                        this.props.onIsLoaded 
                        ?    <Carousel 
                                onMouseDown={this.handleDragStart} 
                                onMouseMove={this.handleDrag} 
                                onMouseLeave={this.handleMouseLeave} 
                                onMouseUp={this.handleDragEnd}>
                                {
                                    this.props.onData.map((val, index) => 
                                        <CarouselItem key={index} onImageSrc={val}/>
                                    )
                                }
                            </Carousel>
                        : null
                    }
                </ThemeProvider>
            </Wrapper>
        )
    }
}

export default Slider;