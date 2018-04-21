import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
    background-color: rgba(239, 239, 239, .5);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 40px;
    pointer: pointer;
`;

export default ({ children, onClick }) => (
    <Button onClick={onClick}> 
        {children}
    </Button>
)