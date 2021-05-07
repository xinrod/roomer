import { Button } from "@chakra-ui/button";
import { Box, Center, Flex, Heading, Text } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Profiles from "../components/Profiles";
import Signin from "../components/Signin";
import { useAuth } from "../utils/firebase/auth";
import { getProfiles } from "../utils/firebase/db";



function Home() {
  const auth = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [yourProfile, setYours] = useState([]);
  useEffect(() => {
    const fetchProfiles = async () => {
      if (auth.user) {
        const profiles = await getProfiles();
        setProfiles(profiles);
      }
    }
    fetchProfiles();
  }, [auth])
  useEffect(() => {

    let yourProfile = {}
    for (let i = 0; i < profiles.length; i++) {
      let profile = profiles[i]
      if (profile.uid === auth.user.uid) {
        yourProfile = profile;
        break;
      }

    }
    setYours(yourProfile);
  }, [profiles])
  if (auth.user) {
    return (

      <Flex w="100vw" height="100vh" direction="column" align="center">
        <Header w="100%" mb={5} />
        <Heading alignSelf="start" ml={6}>
          People Looking for Roommates!
      </Heading>
        <Box overflow="scroll" w="100%" p={6}>
          <Profiles profiles={profiles} yourProfile={yourProfile}/>

        </Box>
      </Flex>



    );
  }
  return (<Signin />)
}

export default Home;