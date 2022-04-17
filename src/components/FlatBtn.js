import React from 'react';
import { Button } from '@chakra-ui/react'

export default function FlatBtn(props) {
  return (
    <Button
        {...props}
        borderRadius='0'
        bg="transparent"
        border="1px solid black"
        boxShadow="4px 4px black"
        _hover={{
            boxShadow: "none",
        }}
        _focus={{}}
        _active={{}}
    >{props.children}</Button>
  )
}
