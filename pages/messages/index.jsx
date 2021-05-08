import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Box, Flex, Heading, Text, VStack } from "@chakra-ui/layout";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/modal";
import { Spinner } from "@chakra-ui/spinner";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useAuth } from "../../utils/firebase/auth";


const Message = ({ message }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const formattedMessage = message.message.split('\n').map(str => (<Text my={2}>{str}</Text>))
  return (
    <>
      <Button border="1px" borderColor="gray.200" borderRadius={4} p={6} w={["280px","500px"]} h="60px" fontSize={["10px", "md"]}colorScheme={"whatsapp"} _hover={{
        fontSize: ["sm","lg"],

        height: "65px"
      }} onClick={onOpen}>
        <Text>
          {!message.read ? "Unread" : ""} Message From {message.sentBy}{!message.read ? "! Click to view!" : ""}
        </Text>
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Message from {message.sentBy}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              {formattedMessage}
            </Text>
            <Text textAlign="end">
              From {message.sentBy}
            </Text>
          </ModalBody>

          <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              
        </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

const Messages = () => {
  const auth = useAuth();
  const [messageData, setMessageData] = useState({})
  useEffect(() => {
    let messageData = {}
    if (auth.messageData) {
      messageData = auth.messageData
    }
    setMessageData(messageData);
  }, [auth])
  const { messages, unread } = messageData;
  return (
    <>
      <Header />
      <Flex flexDir="column" maxW="900px" m="auto">
        <Heading>
          Inbox
      </Heading>
        <VStack alignSelf="start" justifySelf="flex-start" m={4}>
          {Array.isArray(messages) ? messages.map((message, idx) => <Message message={message} key={idx} />) : <Spinner />}
        </VStack>
      </Flex>
    </>
  );

}

export default Messages