import React from 'react';
import styled from 'styled-components';

const Item = styled.div`
    flex: 0 0 100%;
    height: inherit;
    position: relative;
`;

const Image = styled.img`
    height: inherit;
    width: 100%;
    touch-action: none
    user-drag: none; 
    user-select: none;
`;

export default (props) => {
    return (
        <Item>
            <Image src={props.onImageSrc.images[0].tn} alt={props.onImageSrc.metadesc} />
        </Item> 
    );
}