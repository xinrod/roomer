import { Button } from "@chakra-ui/button";
import { Box, Flex, Heading } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Profiles from "../components/Profiles";
import Signin from "../components/Signin";
import { useAuth } from "../utils/firebase/auth";
import { getProfiles, addPseudoUsers, mergeProfileUsers,  } from "../utils/firebase/db";



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
    if (auth.user) {
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
      if (profiles.length >= 1 && profiles.length < 6) {
        addPseudoUsers();
      }
    }
  }, [profiles])
  if (auth.user) {
    return (

      <Flex w="100vw" height="100vh" direction="column" align="center">
        <Header w="100%" mb={6} />
        <Box overflow="scroll" w="100%" p={6}>
        {/* <Button onClick={mergeProfileUsers}>Test</Button> */}
        <Heading alignSelf="start" ml={6}>
          People Looking for Roommates!
      </Heading>
          <Profiles profiles={filtered} yourProfile={yourProfile} />

        </Box>
      </Flex>



    );
  }
  return (<Signin />)
}

export default Home;