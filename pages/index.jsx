import { Box, Flex, Heading } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Profiles from "../components/Profiles";
import Signin from "../components/Signin";
import { useAuth } from "../utils/firebase/auth";
import { getProfiles, addPseudoUsers } from "../utils/firebase/db";



function Home() {
  const auth = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [yourProfile, setYours] = useState([]);
  const [filtered, setFiltered] = useState([]);
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
    const fakes = []
    const real = []
    let yourProfile = {}
    for (let i = 0; i < profiles.length; i++) {
      let profile = profiles[i]
      if (profile.uid === auth.user.uid) {
        yourProfile = profile;
      }
      if ("pseudo" in profile) {
        fakes.push(profile)
      } else {
        real.push(profile)
      }
    }
    setFiltered([...real, ...fakes]);
    setYours(yourProfile);
    if (profiles.length >= 1 && profiles.length < 6 && auth.user) {
      addPseudoUsers();
    }
  }, [profiles])
  if (auth.user) {
    return (

      <Flex w="100vw" height="100vh" direction="column" align="center">
        <Header w="100%" mb={5} />
        <Heading alignSelf="start" ml={6}>
          People Looking for Roommates!
      </Heading>
        <Box overflow="scroll" w="100%" p={6}>
          <Profiles profiles={filtered} yourProfile={yourProfile}/>

        </Box>
      </Flex>



    );
  }
  return (<Signin />)
}

export default Home;