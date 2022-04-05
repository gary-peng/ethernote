import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import EtherNote_abi from './contracts/EtherNote_abi.json'
import { create } from 'ipfs-http-client'

import { Flex, Button, Textarea} from '@chakra-ui/react'
import NoteSelector from './components/NoteSelector';
import { getNodeText } from '@testing-library/react'

const ethUtil = require('ethereumjs-util');
const sigUtil = require('@metamask/eth-sig-util');

const contractAddress = '0xb11f25d7961cb0C6111aC9349904c8Ec25A114c2';
var notes = {notes: [""]};
var walletAddr = "";
var contract = null;

export default function EtherNote() {
    const [connected, setConnected] = useState(false);
    const [currNote, setCurrNote] = useState("")
    const [currNoteInd, setCurrNoteInd] = useState(0)

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

	window.ethereum.on('accountsChanged', handleAccountChange);
	window.ethereum.on('chainChanged', handleChainChange);

	const saveNotes = async () => {
        const obj = {
            notes: [
                "This is an example sentence1",
                "This is an example sentence2",
                "This is an example sentence3",
                "This is an example sentence4",
                "This is an example sentence5",
                "This is an example sentence6",
                "This is an example sentence7",
                "This is an example sentence8",
            ]
        };

        const pubKey = await window.ethereum.request({
            method: 'eth_getEncryptionPublicKey',
            params: [walletAddr],
        });

        const encryptedMessage = ethUtil.bufferToHex(
            Buffer.from(
              JSON.stringify(
                sigUtil.encrypt({
                  publicKey: pubKey,
                  data: JSON.stringify(notes),
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

        const res = await fetch("https://ipfs.infura.io:5001/api/v0/cat?arg=" + hash, {method: 'POST'})
        const val = await res.text()

        const decryptedMessage = await window.ethereum.request({
            method: 'eth_decrypt',
            params: [val, walletAddr],
        })
        
        console.log(decryptedMessage)
        notes = JSON.parse(decryptedMessage);
        setCurrNote(notes.notes[0]);
	}

    var connectBtn = <Button onClick={connectWallet}>Connect Wallet</Button>;
    if (connected) {
        connectBtn = <Button onClick={connectWallet}>{walletAddr.substring(0, 12)}</Button>
    }

    const handleTextChange = (event) => {
        notes.notes[currNoteInd] = event.target.value;
        console.log(notes)
        setCurrNote(event.target.value)
    }

    useEffect(() => {
        setCurrNote(notes.notes[currNoteInd]);
    });
	
	return (
        <>
            <Flex bg='' justify='flex-end'>
                {connectBtn}
            </Flex>
            <Flex bg='' direction="column">
                <NoteSelector titles={notes.notes} setCurrNoteInd={setCurrNoteInd} />
                <Textarea 
                    value={currNote}
                    onChange={handleTextChange}
                />
                <Button onClick={saveNotes}>Save All Changes</Button>
            </Flex>
        </>
	);
}