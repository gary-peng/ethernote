import React, { useState, useEffect } from 'react'
import { Container, Box, Flex, Text, Heading, Spacer} from '@chakra-ui/react'
import NoteSelector from './components/NoteSelector';
import TextEdit from './components/TextEdit';
import FlatBtn from './components/FlatBtn';

import { ethers } from 'ethers'
import EtherNote_abi from './contracts/EtherNote_abi.json'
import { create } from 'ipfs-http-client'

const ethUtil = require('ethereumjs-util');
const sigUtil = require('@metamask/eth-sig-util');

const contractAddress = '0xf6ea1d9a263bb96b0d22c1689469ee6402590a44';
var walletAddr = "";
var contract = null;

export default function EtherNote() {
    const [connected, setConnected] = useState(false);
    const [currNoteInd, setCurrNoteInd] = useState(0);
    const [notes, setNotes] = useState(["My First Note"]);

    const ipfs = create("https://ipfs.infura.io:5001");

	const connectWallet = async () => {
		if (window.ethereum && window.ethereum.isMetaMask) {
			const res = await window.ethereum.request({ method: 'eth_requestAccounts'});
			handleAccountChange(res[0]);
            setConnected(true);
		} else {
			console.log('Please Install MetaMask');
		}
	}

	const handleAccountChange = async (addr) => {
        walletAddr = addr
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, EtherNote_abi, signer);
        
        getNotes();
	}

	const handleChainChange = () => {
		window.location.reload();
	}

    if (window.ethereum) {
        window.ethereum.on('accountsChanged', handleAccountChange);
	    window.ethereum.on('chainChanged', handleChainChange);
    }

	const saveNotes = async () => {
        const pubKey = await window.ethereum.request({
            method: 'eth_getEncryptionPublicKey',
            params: [walletAddr],
        });

        const encryptedMessage = ethUtil.bufferToHex(
            Buffer.from(
              JSON.stringify(
                sigUtil.encrypt({
                  publicKey: pubKey,
                  data: JSON.stringify({notes: notes}),
                  version: 'x25519-xsalsa20-poly1305',
                })
              ),
              'utf8'
            )
        );

        const { cid } = await ipfs.add(encryptedMessage);
        const hash = cid.toString()
        contract.set(hash);
        console.log(hash);
        console.log(encryptedMessage);
	}

	const getNotes = async () => {
		const hash = await contract.get();
        console.log(hash);

        if (hash != "User not found") {
            const res = await fetch("https://ipfs.infura.io:5001/api/v0/cat?arg=" + hash, {method: 'POST'})
            const val = await res.text()

            const decryptedMessage = await window.ethereum.request({
                method: 'eth_decrypt',
                params: [val, walletAddr],
            })
            
            console.log(decryptedMessage)
            setNotes(JSON.parse(decryptedMessage).notes);
        }
	}

    const TopBtns = () => {
        if (connected) {
            return (
                <>
                    <FlatBtn onClick={saveNotes} mr="4px">Save All Changes</FlatBtn>
                    <FlatBtn onClick={connectWallet}>{walletAddr.substring(0, 12)}</FlatBtn>
                </>
            );
        }

        return <FlatBtn onClick={connectWallet}>Connect Wallet</FlatBtn>;
    } 
    
	
	return (
        <Container bg="" maxW="1000px" h="100%" pt="15px">
            <Flex justify='space-between' align="flex-end" mb="10px">
                <Box p="3px" border="1px solid black" boxShadow="4px 4px black">
                    <Heading as="h1">Ethernote</Heading>
                </Box>
                <Box>
                    {TopBtns()}
                </Box>
            </Flex>
            <Flex bg="" h="90%" border="1px solid black" boxShadow="6px 6px black">
                <NoteSelector notes={notes} setNotes={setNotes} currNoteInd={currNoteInd} setCurrNoteInd={setCurrNoteInd} />
                <TextEdit notes={notes} setNotes={setNotes} currNoteInd={currNoteInd} currNote={notes[currNoteInd]} />
            </Flex>
            <Text align="center" mt="10px">&copy; 2022 with ♥ by Gary Peng</Text>
        </Container>
	);
}