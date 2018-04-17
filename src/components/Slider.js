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
    transform: translateX(-${ props => props.theme.translateValue*props.theme.active}px);
    transition: transform .5s ease-out;
`;

class Slider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: null,
            startPosX: null,
            endPosX: null,
            active: 0,
        }
        this.updateDimensions = this.updateDimensions.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDragEnd = this.handleDragEnd.bind(this);
        this.handleFinishDrag = this.handleFinishDrag.bind(this);
    }

    updateDimensions () {
        this.setState({width: findDOMNode(this).getBoundingClientRect().width});
    }

    componentDidMount () {
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
    }
    
    componentWillUnmount () {
        window.removeEventListener('resize', this.updateDimensions);
    }


    handleDragStart(e) {
        this.setState({startPosX: e.clientX})
    }

    handleDrag(e) {
    }

    handleDragEnd (e) {
        this.setState({endPosX: e.clientX}, 
            this.handleFinishDrag);
    }

    handleFinishDrag () {
        if(this.state.startPosX > this.state.endPosX && this.state.active!==this.props.onData.length-1){
                this.setState({ active: this.state.active + 1})
        } else if(this.state.startPosX < this.state.endPosX && this.state.active!==0) {
                this.setState({ active: this.state.active - 1})
        }
        this.setState({startPosX: null, endPosX: null});
    }

    render() {
        return (
            <Wrapper>
                <ThemeProvider theme={{translateValue: this.state.width, active: this.state.active }}>
                    { 
                        this.props.onIsLoaded 
                        ?    <Carousel onDragStart={this.handleDragStart} onDrag={this.handleDrag} onDragEnd={this.handleDragEnd}>
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