import React from 'react';
import styled from 'styled-components';

const Item = styled.div`
    flex: 0 0 100%;
    display: ${props => {
        console.log(props.theme);
        if(props.theme.active.toString()===props.children._owner.key || (props.theme.active+1).toString()===props.children._owner.key || (props.theme.active-1).toString()===props.children._owner.key){
            return 'block'
        } else {
            return 'none'
        }
    }}};
    transition: display .3s ease-out;
`;

const Image = styled.img`
    width: 100%;
`;

export default (props) => {
    return (
        <Item>
            <Image src={props.onImageSrc.images[0].tn} alt={props.onImageSrc.metadesc} />
        </Item> 
    );
}