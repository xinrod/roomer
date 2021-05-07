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



const ProfileCard = ({ profile }) => {
  const auth = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [message, setMessage] = useState("Hey, lets be roommates!");
  const handleMessage = async () => {
    try {
      const res = await sendMessage(profile.uid, message, auth.user);
    } catch (error) {
      console.log(error)
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
      <Flex border="1px" borderColor="gray.200" borderRadius={4} p={6} w="100%">
        <Box>
          <Box>
            <Heading color="twitter.600" mb={2}>
              {profile.name}
            </Heading>
            <Text>
              Class of <chakra.strong>{profile.grad}</chakra.strong>
            </Text>
          </Box>
          <Text>
            Living <chakra.strong>{profile.campus}-campus</chakra.strong>
          </Text>
          <Text>
            Majoring in <chakra.strong>{profile.major}</chakra.strong>
          </Text>
          <Text>Bio: {profile.bio}</Text>
        </Box>
        <Button alignSelf="center" colorScheme="blue" fontSize="2xl" w={["200px"]} ml="auto" h="50px" onClick={onOpen}>Message</Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Send a message to {profile.name}!</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Textarea onChange={updateMessage} defaultValue="Hey, lets be roommates!" colorScheme="twitter" height="150px"/>
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
  if (Array.isArray(profiles)) {
    return (
      profiles ? profiles.map((profile, idx) => (<ProfileCard profile={profile} key={idx} />)) : <></>
    )
  }
  return <Spinner />
}



export default Profiles