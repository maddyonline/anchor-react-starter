import React from 'react';
import { AnchorWallet, useAnchorWallet } from '@solana/wallet-adapter-react';

const anchor = require("@project-serum/anchor");
const { SystemProgram, Connection } = anchor.web3;


const IDL = {
    "version": "0.0.0",
    "name": "xbasic_1",
    "instructions": [
        {
            "name": "initialize",
            "accounts": [
                {
                    "name": "myAccount",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "user",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "data",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "update",
            "accounts": [
                {
                    "name": "myAccount",
                    "isMut": true,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "data",
                    "type": "u64"
                }
            ]
        }
    ],
    "accounts": [
        {
            "name": "MyAccount",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "data",
                        "type": "u64"
                    }
                ]
            }
        }
    ],
    "metadata": {
        "address": "2j4NMzDYQPLpS2HKLR7EnzPt5MXBt3fT9PeWTvUAznQp"
    }
}


export default function MainApp() {
    const anchorWallet = useAnchorWallet();
    const doIt = async (anchorWallet: AnchorWallet) => {
        console.log("doing it");
        const provider = new anchor.Provider(
            new Connection('https://api.devnet.solana.com'),
            anchorWallet,
            anchor.Provider.defaultOptions(),
        );
        const programId = new anchor.web3.PublicKey(IDL.metadata.address);
        const program = new anchor.Program(IDL, programId, provider);
        console.log({ program });
        const myAccount = anchor.web3.Keypair.generate();
        await program.rpc.initialize(new anchor.BN(1234), {
            accounts: {
                myAccount: myAccount.publicKey,
                user: provider.wallet.publicKey,
                systemProgram: SystemProgram.programId,
            },
            signers: [myAccount],
        });
    }
    React.useEffect(() => {

        if (anchorWallet) {
            doIt(anchorWallet);
        }
    }, [anchorWallet])
    return <>
        <div>hello</div>
    </>
}