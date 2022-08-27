import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    Flex,
    Text
  } from '@chakra-ui/react'

const FAQ = () => {

  return (
    <Box
    marginTop="10%"
    marginBottom="0%"
    float="center">
    <Flex
    justify="center"
    align="center">
    <Accordion
    defaultIndex={[-1]}
    allowMultiple
    width="30%"
    >
    <AccordionItem
    marginBottom="5%">
        <AccordionButton
        fontSize="25px"
        color="white"
        borderColor="transparent"
        padding="10px 30px 10px 30px"
        borderRadius="10px 10px 10px 10px"
        _expanded={{ borderRadius: "10px 10px 0px 0px" }}
        backgroundColor="#50ad4e"
        transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
        _hover={{ bg: '#61c25f', color: 'white'
        }}
        >
            <Box flex='1' textAlign='center'
            textColor="White"
            fontFamily="bearfrenz"
            >
            What is the price for minting?
            </Box>
            <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={4}
        marginTop="0%"
        fontSize="20px"
        fontFamily="bearfrenz"
        padding="10px 30px 10px 30px"
        backgroundColor="white"
        borderRadius="0px 0px 10px 10px"
        textColor="#50ad4e"> VIP: 1 free mint | Whitelist: 0.0055 ETH. | public: 0.006 ETH.

        </AccordionPanel>
    </AccordionItem>

    <AccordionItem
    marginBottom="5%">
        <AccordionButton
        color="white"
        borderColor="transparent"
        padding="10px 30px 10px 30px"
        backgroundColor="#50ad4e"
        borderRadius="10px 10px 10px 10px"
        _expanded={{ borderRadius: "10px 10px 0px 0px" }}
        transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
        _hover={{ bg: '#61c25f', color: 'white'
        }}
        fontSize="25px">
            <Box flex='1' textAlign='center'
            textColor="White"
            fontFamily="bearfrenz">
            How many can I mint in a transaction? 
            </Box>
            <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={4}
        fontSize="20px"
        fontFamily="bearfrenz"
        padding="10px 30px 10px 30px"
        backgroundColor="white"
        borderRadius="0px 0px 10px 10px"
        textColor="#50ad4e">
        You can mint 5 NFT&apos;s per transaction.
        </AccordionPanel>
    </AccordionItem>

    <AccordionItem
    marginBottom="5%">
        <AccordionButton
        color="white"
        padding="10px 30px 10px 30px"
        backgroundColor="#50ad4e"
        borderRadius="10px 10px 10px 10px"
        _expanded={{ borderRadius: "10px 10px 0px 0px" }}
        transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
        _hover={{ bg: '#61c25f', color: 'white'
        }}
        borderColor="transparent"
        fontSize="25px">
            <Box flex='1' textAlign='center'
            textColor="White"
            fontFamily="bearfrenz">
            What is the total supply?
            </Box>
            <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={4}
        fontSize="20px"
        fontFamily="bearfrenz"
        padding="10px 30px 10px 30px"
        backgroundColor="white"
        borderRadius="0px 0px 10px 10px"
        textColor="#50ad4e">
        The total supply is 5555.
        </AccordionPanel>
    </AccordionItem>

    <AccordionItem
    marginBottom="10%">
        <AccordionButton
        color="white"
        fontSize="25px"
        padding="10px 30px 10px 30px"
        backgroundColor="#50ad4e"
        borderRadius="10px 10px 10px 10px"
        _expanded={{ borderRadius: "10px 10px 0px 0px" }}
        transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
        _hover={{ bg: '#61c25f', color: 'white'
        }}
        borderColor="transparent"
        >
            <Box flex='1' textAlign='center'
            textColor="White"
            fontFamily="bearfrenz">
            When will reveal happen?
            </Box>
            <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={4}
        padding="10px 30px 10px 30px"
        backgroundColor="white"
        borderRadius="0px 0px 10px 10px"
        textColor="#50ad4e"
        fontSize="20px"
        fontFamily="bearfrenz">
        Reveal is instant.
        </AccordionPanel>
    </AccordionItem>
    </Accordion>
    </Flex>
    </Box>
  );
};
export default FAQ;