import React from 'react';
import { Button, Flex, useRadioGroup  } from '@chakra-ui/react';
import SelectorBtn from './SelectorBtn';

export default function NoteSelector(props) {
    const { value, getRootProps, getRadioProps } = useRadioGroup({
        defaultValue: "0",
        onChange: (i) => props.setCurrNoteInd(i),
    })

    const noteList = props.titles.map((el, i) => {
        const iStr = i.toString();
        const radio = getRadioProps({ value:iStr })

        return (
            <SelectorBtn key={iStr} title={el} {...radio} />
        )
    });
    
    const group = getRootProps()

    return (
        <Flex h="200px" direction="column" overflowY="scroll" {...group}>
            {noteList}
        </Flex>
    )
}
