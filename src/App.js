import React, { Component } from 'react';
import styled from 'styled-components';
import Slider from './components/Slider';

const Wrapper = styled.div`
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    overflow-x: hidden;
    position: relative;
    height: 420px;
    width: 800px;
    @media(max-width: 768px){
        width: 100%;
        height: 168px;
    }
`;

const TextWrapper = styled.div`
    background: rgba(0, 0, 0, 0.9);
    border-radius: 10px;
    padding: 20px;
    color: white;
    position: absolute;
    left: 80px;
    right: 80px;
    bottom: 40px;

    @media(max-width: 768px) {
        display: none;
    }
`;

const Headline = styled.h4`
    margin: 0;
    font-size: 14px;
`;

const Description = styled.p`
    margin: 0;
    font-size: 12px;
`;

const ImageWrapper = styled.div`
    position: relative;
    flex: 0 0 100%;
    height: 420px;

    @media(max-width: 768px){
        width: 100%;
        height: 168px;
    }
`;

const Image = styled.img`
    object-fit: fill;
    width: 100%;
    touch-action: none;
    user-select: none;
    user-drag: none;
`;

class App extends Component {
    constructor(){
        super();
        this.state = {
            error: null,
            isLoaded: false,
            items: []
        }
    }

    componentDidMount() {
        fetch('https://svc.rappler.com/p/topstories')
        .then((res) => res.json())
        .then(({data}) => this.setState({
            isLoaded: true,
            items: data
        }))
        .catch(error => this.setState({error}));
    }


    render() {
        return (
            <Wrapper>
                <Slider autoplay autoplaySpeed>
                    {
                        this.state.isLoaded 
                            ? this.state.items.map((data, index)    => {
                                    return (
                                        <ImageWrapper key={index}>
                                            <TextWrapper>
                                                <Headline>
                                                    {data.title}
                                                </Headline>
                                                <Description>
                                                    {data.metadesc}
                                                </Description>
                                            </TextWrapper>
                                            <Image src={data.images[0].tn} alt={data.metadesc}/>
                                        </ImageWrapper>
                                    )
                                })
                            : null
                    }
                </Slider>
            </Wrapper>
        );
    }
}

export default App;
