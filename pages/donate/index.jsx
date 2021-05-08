import { useAuth } from "../../utils/firebase/auth";
import { Box, Flex, Heading, Text } from "@chakra-ui/layout";
import Signin from "../../components/Signin";
import CheckoutForm from "../../components/CheckoutForm";
import Header from "../../components/Header";


export default function Donate() {

  const auth = useAuth();
  return (
    auth.user ?
      <Flex w="100vw" height="100vh" direction="column" align="center">
        <Header w="100%" mb={5} />
        <Box>
          <Box w="100%" >
            <Heading mb={2}>Donate with Stripe Checkout</Heading>
            <Text>Donate to this project 💖</Text>
            <CheckoutForm />
          </Box>
        </Box>
      </Flex>
      :
      <Signin />
  )
}
