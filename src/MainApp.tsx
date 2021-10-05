import * as anchor from "@project-serum/anchor";
import { useWallet } from '@solana/wallet-adapter-react';

const { SystemProgram } = anchor.web3;

const provider = anchor.Provider.defaultOptions();
const programId = new anchor.web3.PublicKey(
    "E5s3D6B3PJinuB9kb3dicxfi3qUNLUGX6hoPawhbqagt"
);

const idl = JSON.parse(`{
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
  }`);

async function DoIt(publicKey: string | undefined) {
    if (publicKey === undefined) {
        return;
    }

    const myAccount = anchor.web3.Keypair.generate();
    const program = new anchor.Program(idl, programId);

    // Create the new account and initialize it with the program.
    // #region code-simplified
    await program.rpc.initialize(new anchor.BN(1234), {
        accounts: {
            myAccount: myAccount.publicKey,
            user: publicKey,
            systemProgram: SystemProgram.programId,
        },
        signers: [myAccount],
    });

}

export default function MainApp() {
    const { publicKey } = useWallet();
    return <>
        {publicKey && <button onClick={() => DoIt(publicKey?.toString())}>Do It</button>}
        <pre>{JSON.stringify({ provider, programId, anchor }, null, 2)}</pre>;
    </>
}