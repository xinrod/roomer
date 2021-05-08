import { Button } from "@chakra-ui/button";
import { FormLabel, FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Flex, Heading, HStack, Text,  } from "@chakra-ui/layout";
import { Radio, RadioGroup } from "@chakra-ui/radio";
import { chakra } from "@chakra-ui/system";
import { Textarea } from "@chakra-ui/textarea";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Signin from "../../components/Signin";
import { useAuth } from "../../utils/firebase/auth";
import { createProfile, getProfile } from "../../utils/firebase/db";
import { useRouter } from 'next/router';
import { CUIAutoComplete } from 'chakra-ui-autocomplete'
import { majors } from '../../utils/majors';

function MajorAutocomplete({ selectedItems, setSelectedItems }) {
    let majorsFormatted = majors.map(val => ({ value: val.value, label: val.value }));
    const [pickerItems, setPickerItems] = useState(majorsFormatted);

    const handleCreateItem = (item) => {
        setPickerItems((curr) => [...curr, item]);
        setSelectedItems((curr) => [...curr, item]);
    };

    const handleSelectedItemsChange = (selectedItems) => {
        if (selectedItems) {
            setSelectedItems(selectedItems);
        }
    };

    return (
        <FormControl id="major">
            <CUIAutoComplete
                label="Enter your Majors"
                placeholder="Type a major"
                onCreateItem={handleCreateItem}
                items={pickerItems}
                selectedItems={selectedItems}
                onSelectedItemsChange={(changes) =>
                    handleSelectedItemsChange(changes.selectedItems)
                }
            />
        </FormControl>
    );
}

export default function Profile() {
    const auth = useAuth();

    const router = useRouter();
    const [profileData, setProfileData] = useState({});
    const [old, setOld] = useState({})
    const [selectedItems, setSelectedItems] = useState([]);
    const [campus, setCampus] = useState("")
    useEffect(() => {
        if (auth.user) {
            const getOld = async (uid) => {
                const res = await getProfile(uid);
                setOld(res);
            }
            getOld(auth.user.uid)
        }
    }, [auth])
    useEffect(() => {
        let majorArray = []
        let campus = ""
        if ("major" in old) {
            majorArray = old.major.split(', ').map((val) => ({ value: val, label: val }))
        }
        setSelectedItems(majorArray)
        if ("campus" in old) campus = old.campus
        setCampus(campus);
    }, [old])
    useEffect(async () => {
        if (profileData != {} && 'major' in profileData && 'campus' in profileData && 'hometown' in profileData && 'bio' in profileData) {
            await createProfile(auth.user.uid, profileData)
            router.push('/')
        }

    }, [profileData])
    const handleCampusChange = (e) => {
        setCampus(e);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const majors = selectedItems.map((majorObject) => (majorObject.value)).reduce((acc, major) => (acc + ", " + major), "").slice(2);

        setProfileData({
            name: e.target.name.value,
            major: majors,
            campus: e.target.campus.value,
            hometown: e.target.hometown.value,
            grad: e.target.grad.value,
            bio: e.target.bio.value,
        })
    }
    if (auth.user) {
        return (

            <Flex w="100vw" height="100vh" direction="column" align="center">
                <Header w="100%" mb={4} />
                <Flex direction="column" w="100%" maxW={["300px", "400px"]}>
                    <Heading as="h1" size="lg" letterSpacing={"-.1rem"} mb={6}>
                        Update your profile!
          </Heading>
                    <chakra.form onSubmit={handleSubmit}>
                        <FormControl id="name" mb={2}>
                            <FormLabel id="name">
                                Name
                </FormLabel>
                            <Input name="name" defaultValue={old?.name} placeholder="Enter your name year"/>
                        </FormControl>
                        <FormControl id="email" mb={2}>
                            <FormLabel id="email">
                                Email
                </FormLabel>
                            <Input name="email" defaultValue={old?.email} placeholder="Enter your email"/>
                        </FormControl>
                        <MajorAutocomplete selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
                        <FormControl id="grad" mb={2}>
                            <FormLabel id="grad">
                                Graduation Year
                </FormLabel>
                            <Input name="grad" defaultValue={old?.grad} placeholder="Enter your graduation year">

                            </Input>
                        </FormControl>
                        <FormControl as="fieldset" mb={2}>
                            <FormLabel as="legend">Living on or off campus?</FormLabel>
                            <RadioGroup value={campus} name="campus" colorScheme="blue" onChange={handleCampusChange}>
                                <HStack>
                                    <Radio value="on" border="1px">on</Radio>
                                    <Radio value="off" border="1px">off</Radio>
                                </HStack>
                            </RadioGroup>
                        </FormControl>
                        <FormControl id="hometown" mb={2} >
                            <FormLabel>Hometown</FormLabel>
                            <Input name="hometown" defaultValue={old?.hometown} placeholder="Enter your hometown" />
                        </FormControl>
                        <FormControl id="bio" mb={2}>
                            <FormLabel id="bio">
                                Bio
                </FormLabel>
                            <Textarea name="bio" defaultValue={old?.bio} placeholder="Write a short bio about yourself!">

                            </Textarea>
                        </FormControl>

                        <Box w="100%" align="start">
                            <Button type="submit">Update and post your profile!</Button>
                        </Box>
                        <Text colorScheme="telegram" fontSize="xs" my={4}>
                            Note: your profile picture is taken off of your 3rd party login, so if you want to change it, change it there! Sorry, file storage is expensive :(.
                        </Text>


                    </chakra.form>
                </Flex>
            </Flex>
        );
    }
    return (<Signin />)
}
