import React from "react";
import { Box, Heading, Flex, Text, Button } from "@chakra-ui/react";
import { useAuth } from "../utils/firebase/auth";
import Link from 'next/Link'

const MenuItems = ({ children }) => {
    console.log(children.toLowerCase())
    return (
        <Link href={`/${children.toLowerCase()}`}>
            <Button bg="transparent" mt={{ base: 4, md: 0 }} mr={6} display="block"
                _hover={{

                }}
            >
                {children}
            </Button>
        </Link>
    )
};

const Header = props => {
    const [show, setShow] = React.useState(false);
    const handleToggle = () => setShow(!show);
    const auth = useAuth();

    return (
        <Flex
            as="nav"
            align="center"
            justify="space-between"
            wrap="wrap"
            padding="1.5rem"
            bg="teal.500"
            color="white"
            {...props}
        >
            <Flex align="center" mr={5}>
                <Link href="/">
                <Button bg="transparent" _hover={{}}>
                    <Heading as="h1" size="lg" letterSpacing={"-.1rem"}>
                        Roomer
                </Heading>
                </Button>
                </Link>
            </Flex>

            <Box display={{ base: "block", md: "none" }} onClick={handleToggle}>
                <svg
                    fill="white"
                    width="12px"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <title>Menu</title>
                    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                </svg>
            </Box>

            <Box
                display={{ base: show ? "block" : "none", md: "flex" }}
                width={{ base: "full", md: "auto" }}
                align="center"
                flexGrow={1}
            >
                <MenuItems>Profile</MenuItems>
                <MenuItems>Donate</MenuItems>
            </Box>

            <Box
                display={{ base: show ? "block" : "none", md: "block" }}
                mt={{ base: 4, md: 0 }}
                width={{ base: "full", md: "auto" }}
                align="center"
            >
                <Button bg="transparent" border="1px" onClick={auth.signout} ml={-5}>
                    Signout
        </Button>
            </Box>
        </Flex>
    );
};

export default Header;
