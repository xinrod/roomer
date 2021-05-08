import { Button } from "@chakra-ui/button";
import { HStack } from "@chakra-ui/layout";
import { Modal, ModalCloseButton, ModalContent, ModalOverlay, ModalHeader, ModalBody, ModalFooter } from "@chakra-ui/modal"
import { Textarea } from "@chakra-ui/textarea"
import { useState } from "react";
import { useAuth } from "../utils/firebase/auth";
import { sendMessage } from "../utils/firebase/db";



export default function MessageModal({ isOpen, onClose, profile, onOpen }) {
  const auth = useAuth();

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
  );
}