import React, { useState } from 'react';
import { Box, useRadio  } from '@chakra-ui/react';

export default function SelectorBtn(props) {
    const { title, ...radioProps } = props
    const { state, getInputProps, getCheckboxProps } = useRadio(radioProps)

    const input = getInputProps()
    const checkbox = getCheckboxProps()

    return (
        <Box as='label'>
            <input {...input} />
            <Box
                {...checkbox}
                cursor='pointer'
                borderWidth='1px'
                _checked={{
                    bg: 'teal.600',
                    color: 'white',
                    borderColor: 'teal.600',
                }}
                px={5}
                py={3}
            >
                {title}
            </Box>
        </Box>
    );
}
