import React, { useState } from 'react';
import { Flex, Box, useRadio, Button } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

export default function SelectorBtn(props) {
    const { title, ...radioProps } = props
    const { state, getInputProps, getCheckboxProps } = useRadio(radioProps)

    const input = getInputProps()
    const checkbox = getCheckboxProps()

    const deleteNote = () => {
        const inputVal = parseInt(input.value);
        if (inputVal <= props.currNoteInd && inputVal != 0) {
            props.setCurrNoteInd(props.currNoteInd-1);
        }
        
        props.setNotes((prev) => {
            const temp = [...prev];
            temp.splice(inputVal, 1);
            return temp
        })
    }

    return (   
        <Flex
            as='label'
            {...checkbox}
            cursor='pointer'
            borderBottom="1px solid black"
            _checked={{
                bg: 'black',
                color: 'white',
                border: null,
            }}
            px={5}
            py={3}
            justify='space-between'
        >
            <input {...input} />
            {title}
            <Button 
                onClick={deleteNote}
                bg="transparent"
                border={null}
                _hover={{}}
                _focus={{}}
                _active={{}}
            ><CloseIcon /></Button>
        </Flex>
    );
}
