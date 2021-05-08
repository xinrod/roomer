import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Box, Flex, Heading, Text, VStack } from "@chakra-ui/layout";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/modal";
import { Spinner } from "@chakra-ui/spinner";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import MessageModal from "../../components/MessageModal";
import Signin from "../../components/Signin";
import { useAuth } from "../../utils/firebase/auth";
import { deleteMessage, readMessage } from "../../utils/firebase/db";

const ReplyModal = ({message, auth}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const replyProfile = {
    name: message.sentBy,
    uid: message.sentByUid
  }
  return (
    <>
    <Button colorScheme="blue" mr={3} onClick={onOpen}>
                Reply
              
        </Button>
        <MessageModal isOpen={isOpen} onOpen={onOpen} profile={replyProfile} onClose={onClose}/>
        </>
  )

}

const Message = ({ message, auth }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const formattedMessage = message.message.split('\n').map((str,idx) => (<Text my={2} key={idx}>{str}</Text>))
  const read = async () => {
    await readMessage(auth.user.uid, message.mid);
   await auth.updateMessages();
  }
  const deleteFunc = async () => {
    await deleteMessage(auth.user.uid, message.mid);
   await auth.updateMessages();
   onClose();
  }
  const handleClose= () => {
    onClose();
    if (!message.read) {
      
      read();
    }
  }
  const handleDelete = () => {
    deleteFunc();
    
  }
  return (
    <>
      <Button border="1px" borderColor="gray.200" borderRadius={4} p={6} w={["280px","500px"]} h="60px" fontSize={["10px", "md"]}colorScheme={"whatsapp"} _hover={{
        fontSize: ["","lg"],
        height: "65px"
      }} onClick={onOpen}>
        <Text>
          {!message.read ? "Unread" : ""} Message From {message.sentBy}{!message.read ? "! Click to view!" : ""}
        </Text>
      </Button>
      <Modal isOpen={isOpen} onClose={handleClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Message from {message.sentBy}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            
              {formattedMessage}
            
            <Text textAlign="end">
              From {message.sentBy}
            </Text>
          </ModalBody>

          <ModalFooter>
            <ReplyModal message={message} auth={auth}/>
            <Button colorScheme="blue" mr={3} onClick={handleDelete}> Delete</Button>
              <Button colorScheme="blue" mr={3} onClick={handleClose}>
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
  const [filtered, setFiltered] = useState()
  useEffect(() => {
    let messageData = {}
    if (auth.messageData ) {
      messageData = auth.messageData
    }
    setMessageData(messageData);
  }, [auth])

  useEffect(() => {
    const read = []
    const unread = []
    if ("messages" in messageData && Array.isArray(messageData.messages)) {
      messageData.messages.forEach((message)=> {
        if (message.read) {
          read.push(message)
        } else {
          unread.push(message)
        }
      })
    }
    setFiltered([...unread, ...read])
  }, [messageData])
  if (auth.user) {
  return (
    <>
      <Header />
      <Flex flexDir="column" maxW="900px" m="auto" align="center">
        <Heading mt={6}>
          Inbox
      </Heading>
        <VStack alignSelf="center" justifySelf="flex-start" m={4}>
          {Array.isArray(filtered) && filtered.length > 0 ? filtered.map((message, idx) => <Message message={message} auth={auth} key={idx} />) : <Spinner />}
        </VStack>
      </Flex>
    </>
  );
  }
  else {
    return <Signin/>
  }
}

export default Messages