import { Button } from "@chakra-ui/button";
import { Box, Center, Flex, Heading, Text } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Profiles from "../components/Profiles";
import Signin from "../components/Signin";
import { getProfiles, useAuth } from "../utils/firebase/auth";



function Home() {
  const auth = useAuth();
  const [profiles, setProfiles] = useState();
  
  useEffect(()=>{
    const fetchProfiles = async () => {
      const profiles = await getProfiles();
      setProfiles(profiles);
    }
    fetchProfiles();
  },[])
  return (
    auth.user ? 
    <Flex w="100vw" height="100vh" direction="column" align="center">
      <Header w="100%" mb={5}/>
      <Heading alignSelf="start" ml={6}>
        People Looking for Roommates!
      </Heading>
      <Box overflow="scroll" w="100%" p={6}>
        <Profiles profiles={profiles} />

      </Box>
    </Flex>
    :
    <Signin/>
    
  );
}

export default Home;