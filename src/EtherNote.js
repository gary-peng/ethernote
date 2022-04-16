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
// var notes = [];
var walletAddr = "";
var contract = null;

export default function EtherNote() {
    const [connected, setConnected] = useState(false);
    const [currNoteInd, setCurrNoteInd] = useState(0);
    const [notes, setNotes] = useState(["New Note"]);


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

        const res = await fetch("https://ipfs.infura.io:5001/api/v0/cat?arg=" + hash, {method: 'POST'})
        const val = await res.text()

        const decryptedMessage = await window.ethereum.request({
            method: 'eth_decrypt',
            params: [val, walletAddr],
        })
        
        console.log(decryptedMessage)
        setNotes(JSON.parse(decryptedMessage).notes);
	}

    var connectBtn = <Button onClick={connectWallet}>Connect Wallet</Button>;
    if (connected) {
        connectBtn = <Button onClick={connectWallet}>{walletAddr.substring(0, 12)}</Button>
    }

    const handleTextChange = (event) => {
        setNotes((prev) => {
            const temp = [...prev];
            temp[currNoteInd] = event.target.value
            return temp
        })

        console.log(notes)
    }
	
	return (
        <>
            <Flex bg='' justify='flex-end'>
                {connectBtn}
            </Flex>
            <Flex bg='' direction="column">
                <NoteSelector notes={notes} setNotes={setNotes} currNoteInd={currNoteInd} setCurrNoteInd={setCurrNoteInd} />
                <Textarea 
                    value={notes[currNoteInd]}
                    onChange={handleTextChange}
                />
                <Button onClick={saveNotes}>Save All Changes</Button>
            </Flex>
        </>
	);
}