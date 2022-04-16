import React, { useEffect } from 'react';
import { Button, Flex, useRadioGroup  } from '@chakra-ui/react';
import SelectorBtn from './SelectorBtn';
import { AddIcon } from '@chakra-ui/icons';

export default function NoteSelector(props) {
    const { value, setValue, getRootProps, getRadioProps } = useRadioGroup({
        defaultValue: "0",
        onChange: (i) => props.setCurrNoteInd(parseInt(i)),
    })

    useEffect(() => {
        setValue(props.currNoteInd + "");
    }, [props.currNoteInd]);

    const noteList = props.notes.map((el, i) => {
        const iStr = i.toString();
        const radio = getRadioProps({ value:iStr })

        const title = el.substring(0, 20).split("\n")[0]

        return (
            <SelectorBtn {...props} key={iStr} title={title} {...radio} />
        )
    });

    const newNote = () => {
        const len = props.notes.length
        props.setNotes((prev) => {
            const temp = [...prev];
            temp.push("New Note");
            return temp
        })
        
        props.setCurrNoteInd(len);
    }

    return (
        <Flex w="30%" h="100%" direction="column" overflowY="scroll" {...getRootProps()}>
            {noteList}
            <Button onClick={newNote} borderRadius='0'><AddIcon /></Button>
        </Flex>
    )
}
