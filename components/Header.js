import React, { useState, useEffect } from "react";
import { Button, Flex, Link, Spacer, Text } from '@chakra-ui/react';
import Ethereum from "../public/social-media-icons/ethereum2.png";
import Twitter from "../public/social-media-icons/twitter.png";
import Discord from "../public/social-media-icons/Discord.png";
import Claw from "../public/social-media-icons/clawicon.png";
import { useStatus } from "../context/statusContext";
import Image from 'next/image';
import "bootstrap/dist/css/bootstrap.min.css";

const NavBar = () => {
    const { setStatus } = useStatus();
	const [currentAccount, setCurrentAccount] = useState('');

    /*async function connectAccount() {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts"
            })
            setAccounts(accounts);
        }
    }*/

    useEffect(() => {
        const interval=setInterval(()=>{
            checkIfWalletIsConnected()
        },1000)

        return()=> clearInterval(interval)
	})


    const checkIfWalletIsConnected = async () => {
		const { ethereum } = window

		const accounts = await ethereum.request({ method: 'eth_accounts' })

		if (accounts.length !== 0) {
			setCurrentAccount(accounts[0])
		}
	}

    const connectWallet = async () => {
		try {
			const { ethereum } = window

			if (!ethereum) {
				console.log('Metamask not detected')
				return
			}
			let chainId = await ethereum.request({ method: 'eth_chainId' })
			console.log('Connected to chain:' + chainId)

			const rinkebyChainId = '0x5'

			const devChainId = 1337
			const localhostChainId = `0x${Number(devChainId).toString(16)}`

			if (chainId !== rinkebyChainId && chainId !== localhostChainId) {
				Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: "You're connected to the wrong network!",
                    confirmButtonColor: "#50a944",
                    confirmButtonText: "CHANGE NETWORK"
                  }).then((result) => {
                    changeNetwork()
                  })
				return
			}

			const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

			console.log('Found account', accounts[0])
			setCurrentAccount(accounts[0]).then(checkWhitelisted())
		} catch (error) {
			console.log('Error connecting to metamask', error)
		}
	}

    

    return (
        <Flex justify="center" align="center" padding="2px" position="sticky" top="0" backgroundColor="rgb(80, 173, 78, .6)" zIndex="2" boxShadow="10px 10px 30px rgb(80, 173, 78, .8)">
            <Flex justify="space-between" width="12%" marginTop="10px">
                <Link href="https://www.discord.com"
                maxWidth="50%">
                    <Image
                    src={Discord}
                    className="logo"
                    width={30}
                    height={30}/>
                </Link>
                <Link href="https://www.etherscan.io"
                maxWidth="20%">
                    <Image
                    src={Ethereum}
                    className="logo"
                    width="30px"
                    height="30px"
                    />
                </Link>
                <Link href="https://twitter.com/bearfrenznft">
                    <Image
                    src={Twitter}
                    className="logo"
                    width="30px"
                    height="30px"/>
                </Link>
            </Flex>
            <Text
            marginLeft="12%"
            fontSize="40px"
            marginTop="15px"
            fontFamily="bearfrenz"
            >
                BEARFRENZ
            </Text>
            <Image src={Claw} width="50px" height="50px"/>
            <Button
                marginLeft="15%"
                backgroundColor="#000000"
                transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
                _hover={{ bg: '#50ad4e', color: 'white'
                }}
                bg= "white"
                color="#50ad4e"
                borderColor="transparent"
                fontFamily = "inherit"
                colorScheme= "white"
                borderRadius="10px"
                textAlign="middle"
                fontSize="15px"
                padding="15px 20px 0px 20px"
                onClick={connectWallet}
            >
                { currentAccount === '' ? (<Text>CONNECT WALLET</Text>) : (<Text>CONNECTED!</Text>)}
            </Button>
        </Flex>
    )
}

export default NavBar;