import React from 'react';
import { AnchorWallet, useAnchorWallet } from '@solana/wallet-adapter-react';

const anchor = require("@project-serum/anchor");
const { SystemProgram, Connection } = anchor.web3;


const IDL = {
    "version": "0.0.0",
    "name": "basic_1",
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
        "address": "7oe3AtCRgrQM9YJZWG7jbTqxVafDjXbwY9NHVkDhPpNP"
    }
}




export default function MainApp() {
    const anchorWallet = useAnchorWallet();
    React.useEffect(() => {
        const doIt = async (anchorWallet: AnchorWallet) => {
            console.log("doing it");
            const provider = new anchor.Provider(
                new Connection('https://api.mainnet-beta.solana.com', 'recent'),
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
                    user: anchorWallet.publicKey,
                    systemProgram: SystemProgram.programId,
                },
                signers: [myAccount],
            });
        }
        if (anchorWallet) {
            doIt(anchorWallet);
        }
    }, [anchorWallet])
    return <>
        <div>hello</div>
    </>
}