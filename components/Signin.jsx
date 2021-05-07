import { Flex, Text } from "@chakra-ui/layout"
import GoogleButton from "react-google-button";
import { useAuth } from "../utils/firebase/auth";

const Signin = () => {
    const auth = useAuth();
    const handleGoogleAuth = () => {
        auth.signinWithGoogle();
    }

    return (
        <Flex maxW="1200px" maxHeight="1080px" height="100vh" direction="column" align="center" justify="center" m="auto">
            <Text fontSize={["lg",'2xl']} m={5} textAlign="center">
                Welcome to Roomer! Your premiere UNC roommate finder!
</Text>
            <GoogleButton onClick={handleGoogleAuth}/>
        </Flex>
    )
}
export default Signin