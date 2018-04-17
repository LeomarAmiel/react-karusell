import React, { Component } from 'react';
import styled from 'styled-components';
import Slider from './components/Slider'

const Wrapper = styled.div`
  box-sizing: border-box;
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
                <Slider onIsLoaded={this.state.isLoaded} onData={this.state.items}/>
            </Wrapper>
        );
    }
}

export default App;
