import React, { Component } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import CarouselItem from './CarouselItem';

const Wrapper = styled.div`
    height: 350px;
    position: relative;
    overflow-x: auto;
`;

const Carousel = styled.div`
    margin: 0;
    padding: 0;    
    display: flex;
    justify-content: flex-start;
    transform: translateX(${ 
        props => {
            if(props.theme.end!==null&&props.theme.start!==null){
                return props.theme.end>props.theme.start
                ? props.theme.translateValue
                : '-'+props.theme.translateValue
            } else {
                return 0;
            }
        }
    }px);
    transition: transform .5s ease-out;
`;

class Slider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: window.innerHeight,
            width: window.innerWidth,
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
        this.setState({height: window.innerHeight, width: window.innerWidth});
    }

    componentDidMount () {
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
        this.state.startPosX > this.state.endPosX
            ? this.state.active===this.props.onData.length-1 
                ? this.setState({ active: 0 })
                : this.setState({ active: this.state.active + 1})
            : this.state.active===0 
                ? this.setState({ active: this.props.onData.length-1 })
                : this.setState({ active: this.state.active - 1})
    }

    render() {
        return (
            <Wrapper>
                <ThemeProvider theme={{start: this.state.startPosX, end: this.state.endPosX, translateValue: this.state.width, active: this.state.active }}>
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