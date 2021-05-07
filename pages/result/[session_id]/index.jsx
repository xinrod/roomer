import { Box, Flex, Heading, Text } from "@chakra-ui/layout";
import Header from "../../../components/Header";
import Signin from "../../../components/Signin";
import { useAuth } from "../../../utils/firebase/auth";

export default function Donate() {

  const auth = useAuth();
  return (
    auth.user ?
      <Flex w="100vw" height="100vh" direction="column" align="center">
        <Header w="100%" mb={5} />
        <Box>
          <Box className="page-container" color="twitter.700">
            <Heading mb={6}>Wow! Thank you {auth.user.name.split(' ')[0]} for donating!</Heading>
            <Text>I hope you like this project. Feel free to send me feedback at xinrod@gmail.com. Click Roomer to return to the homepage.</Text>
          </Box>
        </Box>
      </Flex>
      :
      <Signin />
  )
}
