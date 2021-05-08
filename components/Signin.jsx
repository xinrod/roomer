import { Button } from "@chakra-ui/button";
import { Flex, Text, VStack } from "@chakra-ui/layout"
import { Spinner } from "@chakra-ui/spinner";

import GoogleButton from "react-google-button";
import { useAuth } from "../utils/firebase/auth";

const Signin = () => {
    const auth = useAuth();
    const handleGoogleAuth = () => {
        auth.signinWithGoogle();
    }

    const handleFacebookAuth = () => {
        auth.signinWithFacebook();
    }
    const handleGitHubAuth = () => {
        auth.signinWithGitHub();
    }

    return (
        <Flex maxW="1200px" maxHeight="1080px" height="100vh" direction="column" align="center" justify="center" m="auto">
            <Text fontSize={["lg",'2xl']} m={5} textAlign="center">
                Welcome to Roomer! Your premiere UNC roommate finder!
</Text>
             <VStack spacing={2} width="250px">
            <GoogleButton onClick={handleGoogleAuth}/>
            <Button colorScheme="facebook" w="240px" h="50px" my={2} onClick={handleFacebookAuth}>Login with Facebook</Button>
            <Button onClick={handleGitHubAuth} colorScheme="blackAlpha"  w="240px" h="50px">Login with GitHub</Button>

            </VStack> 
        </Flex>
    )
}
export default Signin