import { Button } from "@chakra-ui/button"
import { useDisclosure } from "@chakra-ui/hooks"
import { Image } from "@chakra-ui/image"
import { Box, Flex, Heading, Text } from "@chakra-ui/layout"
import { Skeleton } from "@chakra-ui/skeleton"
import { Spinner } from "@chakra-ui/spinner"
import { chakra } from "@chakra-ui/system"
import { useAuth } from "../utils/firebase/auth"
import MessageModal from "./MessageModal"


const YourProfileCard = ({ profile }) => {
  return (
    <>
      <Flex border="1px" borderColor="gray.200" borderRadius={4} p={6} w="100%" direction={["column", "row"]} alignItems={["center", "center"]} ml="auto">
        <Flex direction={["column", "row"]} w="100%" textAlign={["center", "left"]} align={["center", "start"]}>
          {'photoUrl' in profile ? <Image alignSelf="center" mr={[,8]} borderRadius={100} width={100} height={100} src={profile.photoUrl}
            alt={profile.name + "'s Picture"}
          /> : <Skeleton mr={8} borderRadius={100} width={100} height={100}></Skeleton>}
          <Box>
            <Box>
              <Heading color="Gray.200" >
                {"name" in profile && profile.name !== null  ? profile.name : "Anon"}
              </Heading>
              <chakra.span visibility={["visible"]} fontSize="md" color="gray.600" mb={2} >{(" (This is you! Update your profile if anything is missing!)")}</chakra.span>
              <Text>
                Class of <chakra.strong>{profile.grad ? profile.grad : "not stated"}</chakra.strong>
              </Text>
            </Box>
            <Text>
              Hometown: <chakra.strong>{profile.hometown ? profile.hometown : "not stated"}</chakra.strong>
            </Text>
            <Text>
              Living <chakra.strong>{profile.campus ? `${profile.campus}-campus` : "not stated"}</chakra.strong>
            </Text>
            <Text>
              Majoring in <chakra.strong>{profile.major ? profile.major : "not stated"}</chakra.strong>
            </Text>
            <Text>{profile.bio ? `Bio: ${profile.bio}` : ""}</Text>
          </Box>
        </Flex>
      </Flex>
    </>
  );
}
const ProfileCard = ({ profile, you }) => {
  const auth = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const [message, setMessage] = useState("Hey, lets be roommates!");
  // const handleMessage = async () => {
  //   try {
  //     const res = await sendMessage(profile.uid, message, auth.user);
  //   } catch (error) {
  //     return
  //   }
  //   alert("Message Sent!")
  //   onClose();
  // }
  // const updateMessage = (e) => {
  //   setMessage(e.target.value);
  // }
  return (
    <>
      <Flex border="1px" borderColor="gray.200" borderRadius={4} p={6} w="100%" direction={["column", "row"]} alignItems={["center", "center"]} ml="auto">
        <Flex direction={["column", "row"]} w="100%" textAlign={["center", "left"]} align={["center", "start"]}>
          {'photoUrl' in profile ? <Image alignSelf="center" mr={[,8]} borderRadius={100} width={100} height={100} src={profile.photoUrl}
            alt={profile.name + "'s Picture"}
          /> : <Skeleton mr={8} borderRadius={100} width={100} height={100}></Skeleton>}

          <Box>
            <Box>
              <Heading color="purple" mb={2}>
              {"name" in profile && profile.name !== null  ? profile.name : "Anonymous"}  <chakra.span fontSize="md" color="gray.600">{(you ? " (This is you! Update your profile if anything is missing!)" : "")}</chakra.span>
              </Heading>
              <Text>
                Class of <chakra.strong>{profile.grad ? profile.grad : "not stated"}</chakra.strong>
              </Text>
            </Box>
            <Text>
              Hometown: <chakra.strong>{profile.hometown ? profile.hometown : "not stated"}</chakra.strong>
            </Text>
            <Text>
              Living <chakra.strong>{profile.campus ? `${profile.campus}-campus` : "not stated"}</chakra.strong>
            </Text>
            <Text>
              Majoring in <chakra.strong>{profile.major ? profile.major : "not stated"}</chakra.strong>
            </Text>
            <Text>{profile.bio ? `Bio: ${profile.bio}` : ""}</Text>
          </Box>

          <Button alignSelf={["center", "center"]} justifySelf="flex-end" colorScheme="blue" fontSize={["md", "2xl"]} w={["200px"]} ml={["", "auto"]} h="50px" onClick={onOpen}>Message</Button>
        </Flex>
        <MessageModal isOpen={isOpen} onClose={onClose} onOpen={onOpen} profile={profile}/>
      </Flex>
    </>
  );
}

const Profiles = ({ profiles, yourProfile }) => {
  const auth = useAuth();
  if (Array.isArray(profiles)) {
    return (
      <>
        {yourProfile ? <YourProfileCard profile={yourProfile} /> : <></>}
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