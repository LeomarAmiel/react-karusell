import React, { Component } from 'react';
import styled from 'styled-components';
import Slider from './components/Slider';

const Wrapper = styled.div`
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    overflow: hidden;
    height: 240px;
`;

const Image = styled.img`
    height: 100%;
    width: 100%;
    touch-action: none
    user-drag: none; 
    user-select: none;
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
                <Slider>
                    {
                        this.state.isLoaded 
                            ? this.state.items.map((data, index) => {
                                    return <Image key={index} src={data.images[0].tn} alt={data.metadesc}/>
                                })
                            : null
                    }
                </Slider>
            </Wrapper>
        );
    }
}

export default App;
