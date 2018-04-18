import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import styled, { ThemeProvider } from 'styled-components';
import CarouselItem from './CarouselItem';

const Wrapper = styled.div`
    position: relative;
    width: 500px;
    overflow: hidden;
`;

const Carousel = styled.div`
    margin: 0;
    padding: 0;    
    display: flex;
    justify-content: flex-start;
    transform: translateX(-${ props => props.theme.translateValue}px);
    transition: transform .5s ease-out;
`;

class Slider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: 0,
            clickStartPosX: null,
            clickSlidePosX: null,
            clickEndPosX: null,
            sliderStartPosX: null,
            sliderEndPosX: null,
            translateValue: null,
            dragging: false,
            swipeTreshold: null,
            width: null,
        }
        this.updateDimensions = this.updateDimensions.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDragEnd = this.handleDragEnd.bind(this);
        this.handleFinishDrag = this.handleFinishDrag.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
    }

    updateDimensions () {
        this.setState({
            width: findDOMNode(this).getBoundingClientRect().width, 
            swipeTreshold: (findDOMNode(this).getBoundingClientRect().width * 0.5),
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
        this.setState({clickStartPosX: e.clientX, dragging: true})
    }
    
    handleDrag(e) {
        e.preventDefault();
        if(this.state.dragging) {
            if(this.state.sliderStartPosX === e.clientX || this.state.sliderEndPosX === e.clientX ){
                this.handleDragEnd(e);
            }

            if(Math.abs(this.state.clickSlidePosX - (this.state.clickStartPosX - e.clientX))>10){
                this.setState({ clickSlidePosX: Math.abs(this.state.clickStartPosX - e.clientX)});
            }

        }
    }
    
    handleDragEnd (e) {
        this.setState({clickEndPosX: e.clientX, dragging: false}, 
            this.handleFinishDrag);
    }

    handleMouseLeave (e) {
        if(this.state.clickStartPosX!==null){
            this.setState({clickEndPosX: e.clientX, dragging: false},
                this.handleFinishDrag
            )
        }
    }

    handleFinishDrag () {
        if(this.state.clickStartPosX > this.state.clickEndPosX && this.state.active!==this.props.onData.length-1){
                this.setState({ active: this.state.active + 1});
        } else if(this.state.clickStartPosX < this.state.clickEndPosX && this.state.active!==0) {
                this.setState({ active: this.state.active - 1})
        }
        this.setState({clickStartPosX: null, clickSlidePosX: null, clickEndPosX: null});
    }

    render() {
        return (
            <Wrapper>
                <ThemeProvider theme={ this.state.dragging 
                    ? this.state.active===0
                        ? { translateValue: this.state.clickSlidePosX }
                        : { translateValue: this.state.clickSlidePosX + (this.state.width + this.state.active) }
                    : { translateValue: this.state.width * this.state.active }}>
                    { 
                        this.props.onIsLoaded 
                        ?    <Carousel onMouseDown={this.handleDragStart} onMouseMove={this.handleDrag} onMouseLeave={this.handleMouseLeave} onMouseUp={this.handleDragEnd}>
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