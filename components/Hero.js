import React from "react";;
import { Button, Flex, Input, Text, Image } from '@chakra-ui/react';
import "bootstrap/dist/css/bootstrap.min.css";

const Hero = () => {

    return (
        <Flex className="hero" justify = "center" align = "center" height = "100vh" marginBottom="-15%">
            <Flex width="40%" justify="space-between" zIndex="0" align= "center">
                <Text
                        className="textH"
                        align="left"
                        marginTop='0px'
                        fontFamily="bearfrenz"
                    >
                        Welcome to the jungle!
                    </Text>
            </Flex>
        </Flex>
    );
};

export default Hero;