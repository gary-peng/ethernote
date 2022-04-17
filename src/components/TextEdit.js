import React from 'react'
import { Flex, Button, Textarea } from '@chakra-ui/react'

export default function TextEdit(props) {
    const handleTextChange = (event) => {
        props.setNotes((prev) => {
            const temp = [...prev];
            temp[props.currNoteInd] = event.target.value
            return temp
        })

        // console.log(props.notes)
    }

    return (
        <Flex bg="" w="70%" h="100%" direction="column">
            <Textarea 
                value={props.currNote}
                onChange={handleTextChange}
                w="100%"
                h="100%"
                borderRadius='0'
                border="null"
                _focus={{}}
                _hover={{}}
                resize="none"
            />
        </Flex>
    );
}
