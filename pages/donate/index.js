import {Flex, } from "@chakra-ui/layout";
import Header from "../../components/Header";
import Signin from "../../components/Signin";
import { useAuth } from "../../utils/firebase/auth";



export default function Donate() {

  const auth = useAuth();
  return (
    auth.user ? 
    <Flex w="100vw" height="100vh" direction="column" align="center">
      <Header w="100%"/>
    </Flex>
    :
    <Signin/>
    
  );
}
