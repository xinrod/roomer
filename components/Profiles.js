import { Button } from "@chakra-ui/button"
import { useDisclosure } from "@chakra-ui/hooks"
import { Box, Flex, Heading, HStack, Text } from "@chakra-ui/layout"
import { Modal, ModalCloseButton, ModalContent, ModalOverlay, ModalHeader, ModalBody, ModalFooter } from "@chakra-ui/modal"
import { Spinner } from "@chakra-ui/spinner"
import { chakra } from "@chakra-ui/system"
import { Textarea } from "@chakra-ui/textarea"
import { useState } from "react"
import { useAuth } from "../utils/firebase/auth"
import { sendMessage } from "../utils/firebase/db"



const ProfileCard = ({ profile, you }) => {
  const auth = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [message, setMessage] = useState("Hey, lets be roommates!");
  const handleMessage = async () => {
    try {
      const res = await sendMessage(profile.uid, message, auth.user);
    } catch (error) {
      return
    }
    alert("Message Sent!")
    onClose();
  }
  const updateMessage = (e) => {
    setMessage(e.target.value);
  }
  return (
    <>
      <Flex border="1px" borderColor="gray.200" borderRadius={4} p={6} w="100%" direction={["column", "row"]} alignItems={["center", "center"]} ml="auto">
        <Flex direction={["column", "row"]} w="100%">
          <Box>
            <Box>
              <Heading color="twitter.600" mb={2}>
                {profile.name}  <chakra.span fontSize="md" color="gray.600">{(you ? " (This is you! Update your profile if anything is missing!)" : "")}</chakra.span>
              </Heading>
              <Text>
                Class of <chakra.strong>{profile.grad ? profile.grad : "not stated"}</chakra.strong>
              </Text>
            </Box>
            <Text>
              Living <chakra.strong>{profile.campus ? `${profile.campus}-campus` : "not stated"}</chakra.strong>
            </Text>
            <Text>
              Majoring in <chakra.strong>{profile.major ? profile.major : "not stated"}</chakra.strong>
            </Text>
            <Text>{profile.bio ? `Bio: ${profile.bio}` : ""}</Text>
          </Box>
          <Button alignSelf={["start", "center"]} justifySelf="flex-end" colorScheme="blue" fontSize={["md", "2xl"]} w={["200px"]} ml={["", "auto"]} h="50px" onClick={onOpen}>Message</Button>
        </Flex>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader fontSize={["md", "lg", "xl"]}>Send a message to {profile.name}!</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Textarea onChange={updateMessage} defaultValue="Hey, lets be roommates!" colorScheme="twitter" height="150px" />
            </ModalBody>
            <ModalFooter>
              <HStack spacing={4}>
                <Button alignSelf="center" bg="blue.500" color="white" onClick={handleMessage}>Send Message</Button>
                <Button alignSelf="center" bg="blue.500" color="white" onClick={onClose}>Cancel</Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </>
  );
}

const Profiles = ({ profiles }) => {
  const auth = useAuth();
  if (Array.isArray(profiles)) {
    let yourProfile = undefined;
    profiles.forEach(profile => {
      if (profile.uid === auth.user.uid) {
        yourProfile = profile
      }
    });
    return (
      <>
      <ProfileCard profile={yourProfile} you={true} />
      {profiles ? profiles.map((profile, idx, arr) => {
        if (profile.uid === auth.user.uid) { return }
        return (
          <ProfileCard profile={profile} key={idx} you={false} />
        );
      }) : <></>}
      </>
    )
  }
  return <Spinner />
}



export default Profiles