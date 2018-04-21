import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    position: absolute;
    bottom: 10px;
    display: flex;
    justify-content: center;
    width: inherit;
`;

const Button = styled.button`
    background-color: rgb(255, 255, 255, .8);
    border-radius: 50%;
    box-sizing: border-box;
    margin: 12px;
    padding: 0;
    height: 12px;
    width: 12px;
    pointer: pointer;
    transition: background-color .3s ease-out;
    @media(max-width: 768px) {
        margin: 4px;
    }
`;



export default (props) => {
    var activeButtonStyle = {
        backgroundColor: 'rgb(0, 0, 0, .9)'
    }
    var buttonArr = [];
    for (let i = 0; i < props.onCount; i++){
        buttonArr.push(
            <Button key={i} style={ i === props.onActive ? activeButtonStyle : null  } onClick={() => props.onHandleClick(i)} />
        )
    }
    return (
        <Wrapper>
            {buttonArr}
        </Wrapper>
)};