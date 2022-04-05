import React, { useState } from 'react'
import { ethers } from 'ethers'
import EtherNote_abi from './contracts/EtherNote_abi.json'
import { create } from 'ipfs-http-client'

const ethUtil = require('ethereumjs-util');
const sigUtil = require('@metamask/eth-sig-util');

const contractAddress = '0xb11f25d7961cb0C6111aC9349904c8Ec25A114c2';

export default function EtherNote() {
	const [walletAddr, setWalletAddr] = useState(null);
	const [contract, setContract] = useState(null);
    const [connected, setConnected] = useState(false);

    const ipfs = create("https://ipfs.infura.io:5001");

	const connectWallet = async () => {
		if (window.ethereum && window.ethereum.isMetaMask) {
			const res = await window.ethereum.request({ method: 'eth_requestAccounts'});
			accountChangedHandler(res[0]);
            setConnected(true);
		} else {
			console.log('Please Install MetaMask');
		}
	}

	const accountChangedHandler = async (newAccount) => {
		setWalletAddr(newAccount);

		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		setContract(new ethers.Contract(contractAddress, EtherNote_abi, signer));
	}

	const chainChangedHandler = () => {
		window.location.reload();
	}

	window.ethereum.on('accountsChanged', accountChangedHandler);
	window.ethereum.on('chainChanged', chainChangedHandler);

	const setHandler = async () => {
        const obj = {
            notes: [
                "This is an example sentence lmao xdxd",
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
                  data: JSON.stringify(obj),
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

	const getCurrentVal = async () => {
		const hash = await contract.get();
        console.log(hash);

        const res = await fetch("https://ipfs.infura.io:5001/api/v0/cat?arg=" + hash, {method: 'POST'})
        const val = await res.text()

        const decryptedMessage = await window.ethereum.request({
            method: 'eth_decrypt',
            params: [val, walletAddr],
        })
        
        console.log(decryptedMessage)
        const parsed = JSON.parse(decryptedMessage);
        console.log(parsed)
	}

    var connectBtn = <button onClick={connectWallet}>Connect Wallet</button>;
    if (connected) {
        connectBtn = <button onClick={connectWallet}>Wallet Connected</button>
    }
	
	return (
		<div>
			{connectBtn}
            <h3>Address: {walletAddr}</h3>
            <button onClick={setHandler}>Update Contract</button>
            <button onClick={getCurrentVal}>Get Contract Val</button>
		</div>
	);
}