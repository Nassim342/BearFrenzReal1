import React, { useState, useEffect } from "react";
import { utils, ethers, BigNumber } from "ethers";
import Web3 from 'web3'
import mintingDapp from './abi2.json';
import { Grid, GridItem, Center, Button, Flex, Input, Text, Image } from '@chakra-ui/react';
import { getSaleState, getFreeSaleState, getTotalSupply } from "../utils/utils";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import wlMerkletree from './whitelist.json'
import vipMerkletree from './vipsale.json'

const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')

const MainMint = () => {

    const contractAddress = "0x715978e9c4E45967304A367fE24426Ea1A5c0403";
	const [currentAccount, setCurrentAccount] = useState('');
    const [mintAmount, setMintAmount] = useState(1);
    const [totalSupply, setTotalSupply] = useState(0)
	const [correctNetwork, setCorrectNetwork] = useState(false);
    const [isSaleActive, setIsSaleActive] = useState(false);
    const [isFreeActive, setIsFreeActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isWhitelisted, setIsWhitelisted] = useState(false);
    const [isVip, setIsVip] = useState(false);
    const [hasMinted, setHasMinted] = useState(false);
    const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
    const web3 = createAlchemyWeb3("https://eth-mainnet.g.alchemy.com/v2/Q2WADcmWSaZ7nEJbyQFXGE9bGhU_N3-1");

    useEffect(() => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const prepare = async () => {   
            setIsSaleActive(await getSaleState());
            setIsFreeActive(await getFreeSaleState());
            setTotalSupply(await getTotalSupply())
        }

        checkCorrectNetwork()
        checkIfWalletIsConnected()
        prepare()
        checkWhitelisted()
        checkMinted()
        checkVipSale()

        const interval=setInterval(()=>{
            checkIfWalletIsConnected()
            prepare()
            checkWhitelisted()
            checkMinted()
            checkVipSale()
           },20000)
           

        provider.on('accountsChanged', function (accounts) {
            setCurrentAccount(accounts[0]) ;
        });
        
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
				return
			}
			let chainId = await ethereum.request({ method: 'eth_chainId' })

			const rinkebyChainId = '0x1'

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

    const checkCorrectNetwork = async () => {
		const { ethereum } = window
		let chainId = await ethereum.request({ method: 'eth_chainId' })
		console.log('Connected to chain:' + chainId)

		const goerliChainId = '0x1'

		const devChainId = 1337
		const localhostChainId = `0x${Number(devChainId).toString(16)}`

		if (chainId !== goerliChainId && chainId !== localhostChainId) {
			setCorrectNetwork(false)
		} else {
			setCorrectNetwork(true)
		}
	}

    const changeNetwork = async() => {
        const { ethereum } = window
        const network = await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ 
                chainId: '0x1' 
            }]});
        setCorrectNetwork(true)
    }

    const checkMinted = async () => {
        if (window.ethereum) {
            const contractAddress = "0x715978e9c4E45967304A367fE24426Ea1A5c0403";
            const contract = new web3.eth.Contract(mintingDapp, contractAddress)
            const result = await contract.methods.freeMint(currentAccount).call()
            if (result === '1') {
                setHasMinted(true)
                console.log(result)
            } 
            if (result === "0") {
                setHasMinted(false)
            }
        }
    }
    
    const checkWhitelisted = async () => {
        if (window.ethereum) {
            const buf2hex = x => '0x' + x.toString('hex')
            const leaves = wlMerkletree.map(x => keccak256(x)) 
            const tree = new MerkleTree(leaves, keccak256, { sortPairs: true })
            const proof = tree.getProof(keccak256(currentAccount)).map(x => buf2hex(x.data))
            const root = buf2hex(tree.getRoot())
            const whitelisted = tree.verify(proof, keccak256(currentAccount), root)

            if (whitelisted) {
                setIsWhitelisted(whitelisted)
            } 

            if (!whitelisted) {
                setIsWhitelisted(whitelisted)
            } 

    }}

    const checkVipSale = async () => {
        if (window.ethereum) {
            const buf2hex = x => '0x' + x.toString('hex')
            const leaves = vipMerkletree.map(x => keccak256(x)) 
            const tree = new MerkleTree(leaves, keccak256, { sortPairs: true })
            const proof = tree.getProof(keccak256(currentAccount)).map(x => buf2hex(x.data))
            const root = buf2hex(tree.getRoot())
            const VIP = tree.verify(proof, keccak256(currentAccount), root)

            if (VIP) {
                setIsVip(VIP)
            } 
            
            if (!VIP) {
                setIsVip(false)
            }
    }}

    async function freeMint() {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                contractAddress,
                mintingDapp,
                signer
            );
            const leaves = vipMerkletree.map(x => keccak256(x))
            const tree = new MerkleTree(leaves, keccak256, { sortPairs: true })
            const leaf = keccak256(currentAccount)
            const buf2hex = x => '0x' + x.toString('hex')
            const proof = tree.getProof(leaf).map(x => buf2hex(x.data))
            setIsLoading(true)
            try {
                const response = await contract.functions.mintVIP(proof)
                const txnHash = response.hash
                Swal.fire({
                    title: "Success",
                    text: "Your transaction is on the way!",
                    icon: "success",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#50a944",
                    footer: '<a href="https://etherscan.io/tx/'+ txnHash +'" target="_blank">Follow your transaction here</a>'
                  })
                await response.wait()
                Swal.fire({
                    title: "Confirmed",
                    text: "Your transaction is confirmed on the blockchain!",
                    icon: "success",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#50a944",
                    footer: '<a href="https://etherscan.io/tx/'+ txnHash +'" target="_blank">Check it out here</a>'
                  })
                setIsLoading(false)
            } catch (err) {
                if (err.code === 'INSUFFICIENT_FUNDS') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'You have insufficient funds to mint.',
                        confirmButtonColor: "#50a944",
                        confirmButtonText: "OK"
                    })
                }
                if (err.code === 'UNPREDICTABLE_GAS_LIMIT') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: "You've already minted or you're not whitelisted.",
                        confirmButtonColor: "#50a944",
                        confirmButtonText: "OK"
                    })
                }
                setIsLoading(false)
                console.log(err.code)
            }
        }
    }

    async function handleMint() {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner();
            const price = 0.006 * mintAmount
            const wei = utils.parseEther(price.toString())
            const contract = new ethers.Contract(
                contractAddress,
                mintingDapp,
                signer
                
            );
            setIsLoading(true)
            try {
                const response = await contract.functions.mintPublic(BigNumber.from(mintAmount), {value: wei})
                const txnHash = response.hash
                Swal.fire({
                    title: "Success",
                    text: "Your transaction is on the way!",
                    icon: "success",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#50a944",
                    footer: '<a href="https://etherscan.io/tx/'+ txnHash +'" target="_blank">Follow your transaction here</a>'
                  })
                console.log(response)
                await response.wait()
                Swal.fire({
                    title: "Confirmed",
                    text: "Your transaction is confirmed on the blockchain!",
                    icon: "success",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#50a944",
                    footer: '<a href="https://etherscan.io/tx/'+ txnHash +'" target="_blank">Check it out here</a>'
                  })
                console.log(tx)
                setIsLoading(false)
            } catch (err) {
                if (err.code === 'INSUFFICIENT_FUNDS') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'You have insufficient funds to mint.',
                        confirmButtonColor: "#50a944",
                        confirmButtonText: "OK"
                    })
                }
                setIsLoading(false)
                console.log(err.code)
            }
        }
    }

    async function WLMint() {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner();
            const price = 0.0055 * mintAmount
            const wei = utils.parseEther(price.toString())
            const contract = new ethers.Contract(
                contractAddress,
                mintingDapp,
                signer
            );
            const leaves = wlMerkletree.map(x => keccak256(x))
            const tree = new MerkleTree(leaves, keccak256, { sortPairs: true })
            const leaf = keccak256(currentAccount)
            const buf2hex = x => '0x' + x.toString('hex')
            const proof = tree.getProof(leaf).map(x => buf2hex(x.data))
            setIsLoading(true)
            try {
                const response = await contract.functions.mintWL((proof), BigNumber.from(mintAmount), {value: wei})
                const txnHash = response.hash
                Swal.fire({
                    title: "Success",
                    text: "Your transaction is on the way!",
                    icon: "success",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#50a944",
                    footer: '<a href="https://etherscan.io/tx/'+ txnHash +'" target="_blank">Follow your transaction here</a>'
                  })
                console.log(response)
                await response.wait()
                Swal.fire({
                    title: "Confirmed",
                    text: "Your transaction is confirmed on the blockchain!",
                    icon: "success",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#50a944",
                    footer: '<a href="https://etherscan.io/tx/'+ txnHash +'" target="_blank">Check it out here</a>'
                  })
                console.log(tx)
                setIsLoading(false)
            } catch (err) {
                if (err.code === 'INSUFFICIENT_FUNDS') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'You have insufficient funds to mint.',
                        confirmButtonColor: "#50a944",
                        confirmButtonText: "OK"
                    })
                }
                setIsLoading(false)
                console.log(err.code)
            }
        }
    }

    const handleDecrement = () => {
        if (mintAmount <= 1) return;
        setMintAmount(mintAmount - 1);
    }
    const handleIncrement = () => {
        if (mintAmount >= 5) return;
        setMintAmount(mintAmount + 1);
    }

    return (
                <Flex
                className="minting"
                justify="center"
                /*marginTop={[2, 10, 8]}*/
                position="relative"
                align="center"
                marginBottom="20%"
                >
                {currentAccount === '' ? (
                    <Button
                    backgroundColor="#50ad4e"
                    borderColor="transparent"
                    fontSize="20px"
                    transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
                    _hover={{ bg: '#ffffff', color: '#50ad4e'
                    }}
                    borderRadius="5px"
                    boxShadow = "0px 2px 2px 1px # 808080"
                    color = "white"
                    cursor = "pointer"
                    fontFamily = "inherit"
                    padding = "30px 80px 30px 80px"
                    onClick={connectWallet}>MINT NOW</Button>
                ) : !correctNetwork ? (
                    <Flex align="center" justify="center">
                        <Button
                           backgroundColor="#000000"
                           borderColor="#ffffff"
                           transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
                           _hover={{ bg: '#ffffff', color: '#000000'
                           }}
                           borderRadius="5px"
                           boxShadow = "0px 2px 2px 1px # 0F0F0F"
                           color = "white"
                           fontFamily="inherit"
                           cursor = "pointer"
                           padding = "15px"
                           onClick={changeNetwork}>
                            Change your network
                        </Button>
                    </Flex>
                ) : isFreeActive && isVip && !hasMinted ? ( 
                    <div>
                        <Flex align="center" justify="center">
                                <Text
                                fontSize="45px">
                                    You&apos;re eligble for a free mint!
                                </Text>
                        </Flex>
                            {!isLoading ? (
                                <Button
                                transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
                                _hover={{ bg: '#ffffff', color: '#50ad4e'
                                }}
                                bg= "#50ad4e"
                                color="white"
                                borderColor="transparent"
                                fontFamily = "inherit"
                                colorScheme= "#50ad4e"
                                padding="10px"
                                borderRadius="10px"
                                paddingX="20px"
                                marginLeft="10px"
                                fontSize="20px"
                                marginTop="10px"
                                    onClick={freeMint}>
                                    MINT A FREE NFT NOW
                                </Button>
                            ) : (
                                <Button
                                isLoading
                                loadingText="TXN SUBMITTING"
                                borderColor="transparent"
                                backgroundColor="#50ad4e"
                                variant='outline'
                                borderRadius="5px"
                                boxShadow = "0px 2px 2px 1px # 0F0F0F"
                                color = "white"
                                cursor = "pointer"
                                fontFamily = "inherit"
                                padding = "15px"
                                marginTop = "10px">
                                    TXN SUBMITTING
                                </Button>)}
                    </div>) : isWhitelisted && isSaleActive ? (
                        <Grid h="200px" templateRows='repeat(4, 1fr)' templateColumns="repeat(2, 1fr)" gap={4}>
                        <GridItem rowSpan={4} colSpan={1}>
                        <Image
                        width="400px"
                        src="https://i.gyazo.com/6ae8f282861601441f90adf0aa83f552.gif"
                        alt=""
                        >

                        </Image>
                        </GridItem>
                        <GridItem rowSpan={1} colSpan={1} marginTop="20%"
                        backgroundColor="white"
                        borderRadius="10px 10px 0px 0px"
                        textColor="#50ad4e"
                        marginBottom="-4px"
                        boxShadow="0px -5px 10px 10px rgb(0, 0, 0, .4)">
                            <Text
                                    fontSize="20px"
                                    marginLeft="5%"
                                    marginTop="5%" >
                                You&apos;re Whitelisted!
                                        
                            </Text>
                            <Text
                                    fontSize="20px"
                                    marginLeft="12%"
                                    marginTop="5%" >
                                Mint cost: <Input 
                                type="number"
                                readOnly
                                fontFamily="inherit"
                                backgroundColor="transparent"
                                transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
                                width="90px"
                                height="40px"
                                color="#50ad4e"
                                borderColor="transparent"
                                textAlign="center"
                                fontSize="20px"
                                value={mintAmount * 0.0055}/>
                            </Text>
                        </GridItem>
                        <GridItem className="mintamount" rowSpan={1} colSpan={1}
                        backgroundColor="white"
                        zIndex="1"
                        marginBottom="-4px"
                        textColor="#50ad4e"
                        >
                            There are {totalSupply}/4000 bears minted.
                        </GridItem>
                        <GridItem className="mintamount2" rowSpan={1} colSpan={1}
                        backgroundColor="white"
                        textColor="#50ad4e"
                        zIndex="0"
                        marginBottom="-4px"
                        boxShadow="0px 0px 10px 10px rgb(0, 0, 0, .4)"><Button
                                transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
                                _hover={{ bg: '#61c25f', color: 'white'
                                }}
                                bg= "#50ad4e"
                                color="white"
                                borderColor="transparent"
                                fontFamily = "inherit"
                                colorScheme= "#50ad4e"
                                padding="10px"
                                borderRadius="10px"
                                paddingX="20px"
                                marginLeft="10px"
                                fontSize="20px"
                                marginTop="-4%"
                                onClick={handleDecrement}>
                                    -
                        </Button>
                        <Input 
                                type="number"
                                marginLeft = "20px"
                                readOnly
                                fontFamily="inherit"
                                backgroundColor="transparent"
                                color="#50ad4e"
                                position="relative"
                                height="50px"
                                width="50px"
                                marginTop="8%"
                                borderColor="transparent"
                                textAlign="center"
                                fontSize="30px"
                                value={mintAmount}/>
                        <Button
                                transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
                                _hover={{ bg: '#61c25f', color: 'white'
                                }}
                                bg= "#50ad4e"
                                color="white"
                                borderColor="transparent"
                                fontFamily = "inherit"
                                colorScheme= "#50ad4e"
                                padding="10px"
                                borderRadius="10px"
                                paddingX="20px"
                                marginLeft="10px"
                                fontSize="20px"
                                marginTop="-4%"
                                onClick={handleIncrement}>
                                    +
                        </Button>
                        </GridItem>
                        <GridItem rowSpan={1} colSpan={1}
                        padding='10px 10px 30px 10px'
                        borderRadius="0px 0px 10px 10px"
                        marginBottom="-4px"
                        backgroundColor="white"
                        zIndex="0"
                        boxShadow="0px 20px 10px 10px rgb(0, 0, 0, .4)">
                            {!isLoading ? (
                                <Button
                                transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
                                _hover={{ bg: '#61c25f', color: 'white'
                                }}
                                bg= "#50ad4e"
                                color="white"
                                borderColor="transparent"
                                fontFamily = "inherit"
                                colorScheme= "#50ad4e"
                                padding="10px"
                                borderRadius="10px"
                                paddingX="20px"
                                marginLeft="10px"
                                fontSize="20px"
                                marginTop="10px"
                                    onClick={WLMint}>
                                    MINT NOW
                                </Button>
                            ) : (
                                <Button
                                    isLoading
                                    loadingText="TXN SUBMITTING"
                                    borderColor="transparent"
                                    backgroundColor="white"
                                    variant='outline'
                                    borderRadius="5px"
                                    boxShadow = "0px 2px 2px 1px # 0F0F0F"
                                    color = "white"
                                    cursor = "pointer"
                                    fontFamily = "inherit"
                                    padding = "15px"
                                    marginTop = "10px">
                                    TXN SUBMITTING
                                </Button>)}
                        </GridItem>
                    </Grid>

                    ) : !isWhitelisted && isSaleActive || hasMinted && isSaleActive || !isFreeActive && isSaleActive ? (
                    <Grid h="200px" templateRows='repeat(4, 1fr)' templateColumns="repeat(2, 1fr)" gap={4}>
                        <GridItem rowSpan={4} colSpan={1}>
                        <Image
                        width="400px"
                        src="https://i.gyazo.com/6ae8f282861601441f90adf0aa83f552.gif"
                        alt=""
                        >

                        </Image>
                        </GridItem>
                        <GridItem rowSpan={1} colSpan={1} marginTop="20%"
                        backgroundColor="white"
                        borderRadius="10px 10px 0px 0px"
                        textColor="#50ad4e"
                        marginBottom="-4px"
                        boxShadow="0px -5px 10px 10px rgb(0, 0, 0, .4)">
                            <Text
                                    fontSize="20px"
                                    marginLeft="12%"
                                    marginTop="5%" >
                                Mint cost: <Input 
                                type="number"
                                readOnly
                                fontFamily="inherit"
                                backgroundColor="transparent"
                                transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
                                width="90px"
                                height="40px"
                                color="#50ad4e"
                                borderColor="transparent"
                                textAlign="center"
                                fontSize="20px"
                                value={mintAmount * 0.006}/>
                            </Text>
                        </GridItem>
                        <GridItem className="mintamount" rowSpan={1} colSpan={1}
                        backgroundColor="white"
                        zIndex="1"
                        marginBottom="-4px"
                        textColor="#50ad4e"
                        >
                            There are {totalSupply}/4000 bears minted.
                        </GridItem>
                        <GridItem className="mintamount2" rowSpan={1} colSpan={1}
                        backgroundColor="white"
                        textColor="#50ad4e"
                        zIndex="0"
                        marginBottom="-4px"
                        boxShadow="0px 0px 10px 10px rgb(0, 0, 0, .4)"><Button
                                transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
                                _hover={{ bg: '#61c25f', color: 'white'
                                }}
                                bg= "#50ad4e"
                                color="white"
                                borderColor="transparent"
                                fontFamily = "inherit"
                                colorScheme= "#50ad4e"
                                padding="10px"
                                borderRadius="10px"
                                paddingX="20px"
                                marginLeft="10px"
                                fontSize="20px"
                                marginTop="-4%"
                                onClick={handleDecrement}>
                                    -
                        </Button>
                        <Input 
                                type="number"
                                marginLeft = "20px"
                                readOnly
                                fontFamily="inherit"
                                backgroundColor="transparent"
                                color="#50ad4e"
                                position="relative"
                                height="50px"
                                width="50px"
                                marginTop="8%"
                                borderColor="transparent"
                                textAlign="center"
                                fontSize="30px"
                                value={mintAmount}/>
                        <Button
                                transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
                                _hover={{ bg: '#61c25f', color: 'white'
                                }}
                                bg= "#50ad4e"
                                color="white"
                                borderColor="transparent"
                                fontFamily = "inherit"
                                colorScheme= "#50ad4e"
                                padding="10px"
                                borderRadius="10px"
                                paddingX="20px"
                                marginLeft="10px"
                                fontSize="20px"
                                marginTop="-4%"
                                onClick={handleIncrement}>
                                    +
                        </Button>
                        </GridItem>
                        <GridItem rowSpan={1} colSpan={1}
                        padding='10px 10px 30px 10px'
                        borderRadius="0px 0px 10px 10px"
                        marginBottom="-4px"
                        backgroundColor="white"
                        zIndex="0"
                        boxShadow="0px 20px 10px 10px rgb(0, 0, 0, .4)">
                            {!isLoading ? (
                                <Button
                                transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
                                _hover={{ bg: '#61c25f', color: 'white'
                                }}
                                bg= "#50ad4e"
                                color="white"
                                borderColor="transparent"
                                fontFamily = "inherit"
                                colorScheme= "#50ad4e"
                                padding="10px"
                                borderRadius="10px"
                                paddingX="20px"
                                marginLeft="10px"
                                fontSize="20px"
                                marginTop="10px"
                                    onClick={handleMint}>
                                    MINT NOW
                                </Button>
                            ) : (
                                <Button
                                    isLoading
                                    loadingText="TXN SUBMITTING"
                                    borderColor="transparent"
                                    backgroundColor="white"
                                    variant='outline'
                                    borderRadius="5px"
                                    boxShadow = "0px 2px 2px 1px # 0F0F0F"
                                    color = "white"
                                    cursor = "pointer"
                                    fontFamily = "inherit"
                                    padding = "15px"
                                    marginTop = "10px">
                                    TXN SUBMITTING
                                </Button>)}
                        </GridItem>
                    </Grid>
                   ) : !isSaleActive && isVip ? (
                        <Flex align="center" justify="center">
                            <Text
                                color="white"
                                fontSize="45px"
                                letterSpacing="-5,5%"
                                fontFamily="inherit"
                                textShadow="0 2px 2px #000000"
                            >
                                You&apos;re VIP, the VIP sale commences at 6 PM UTC 29.08.
                            </Text>
                        </Flex>
                    )  : !isSaleActive && isWhitelisted ? (
                        <Flex align="center" justify="center">
                            <Text
                                color="white"
                                fontSize="45px"
                                letterSpacing="-5,5%"
                                fontFamily="inherit"
                                textShadow="0 2px 2px #000000"
                            >
                                You&apos;re whitelisted, WL sale starts 29.08 5 PM UTC.
                            </Text>
                        </Flex>
                    ) : (
                        <Flex align="center" justify="center">
                            <Text
                                color="white"
                                fontSize="45px"
                                letterSpacing="-5,5%"
                                fontFamily="inherit"
                                textShadow="0 2px 2px #000000"
                            >
                                You&apos;re not WL or VIP, Public sale starts at 5 PM UTC
                            </Text>
                        </Flex>
                    )
                    
                }
                </Flex>
    );
};

export default MainMint;
