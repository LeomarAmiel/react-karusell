import React from 'react';
import styled from 'styled-components';

const Item = styled.div`
    flex: 0 0 100%;
`;

const Image = styled.img`
    width: 100%;
        user-drag: none; 
    user-select: none;
`;

export default (props) => {
    return (
        <Item>
            <Image src={props.onImageSrc.images[0].full} alt={props.onImageSrc.metadesc} />
        </Item> 
    );
}