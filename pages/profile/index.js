import { Button } from "@chakra-ui/button";
import { FormLabel, FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Flex, Heading, HStack, Text, VStack, } from "@chakra-ui/layout";
import { Radio, RadioGroup } from "@chakra-ui/radio";
import { chakra } from "@chakra-ui/system";
import { Textarea } from "@chakra-ui/textarea";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Signin from "../../components/Signin";
import { useAuth } from "../../utils/firebase/auth";
import { createProfile, getProfile } from "../../utils/firebase/db";
import { useRouter } from 'next/router';


export default function Profile() {
    const auth = useAuth();
    if (auth.user) {
        const router = useRouter();
        const [profileData, setProfileData] = useState({});
        const [old, setOld] = useState({})
        useEffect(() => {
            const getOld = async (uid) => {
                const res = await getProfile(uid);
                setOld(res);
            }
            getOld(auth.user.uid)
        }, [])
        useEffect(async () => {
            if (profileData != {} && 'major' in profileData && 'campus' in profileData && 'hometown' in profileData && 'bio' in profileData) {
                await createProfile(auth.user.uid, profileData)
                router.push('/')
            }

        }, [profileData])
        const handleSubmit = (e) => {
            e.preventDefault();
            setProfileData({
                name: auth.user.name,
                major: e.target.major.value,
                campus: e.target.campus.value,
                hometown: e.target.hometown.value,
                grad: e.target.grad.value,
                bio: e.target.bio.value,
            })
        }
        return (

            <Flex w="100vw" height="100vh" direction="column" align="center">
                <Header w="100%" mb={4} />
                <Flex direction="column" w="100%" maxW={["300px", "400px"]}>
                    <Heading as="h1" size="lg" letterSpacing={"-.1rem"} mb={6}>
                        Update your profile!
          </Heading>
                    <chakra.form onSubmit={handleSubmit}>
                        <FormControl id="major">
                            <FormLabel>Major</FormLabel>
                            <Input name="major" defaultValue={old?.major} />
                        </FormControl>
                        <FormControl id="grad">
                            <FormLabel id="grad">
                                Graduation Date
                </FormLabel>
                            <Input name="grad" defaultValue={old?.grad}>

                            </Input>
                        </FormControl>
                        <FormControl as="fieldset">
                            <FormLabel as="legend">Living on or off campus?</FormLabel>
                            <RadioGroup defaultValue={old?.campus} name="campus">
                                <HStack>
                                    <Radio value="on">on</Radio>
                                    <Radio value="off">off</Radio>
                                </HStack>
                            </RadioGroup>
                        </FormControl>
                        <FormControl id="hometown" >
                            <FormLabel>Hometown</FormLabel>
                            <Input name="hometown" defaultValue={old?.hometown} />
                        </FormControl>
                        <FormControl id="bio">
                            <FormLabel id="bio">
                                Write a short bio about yourself!
                </FormLabel>
                            <Textarea name="bio" defaultValue={old?.bio}>

                            </Textarea>
                        </FormControl>
                        <Box w="100%" align="center">
                            <Button type="submit">Update and post your profile!</Button>
                        </Box>
                    </chakra.form>
                </Flex>
            </Flex>

        );
    }
    return (<Signin />)
}
