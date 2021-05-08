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
import { CUIAutoComplete } from 'chakra-ui-autocomplete'
import { majors } from './majors';

function MajorAutocomplete({selectedItems, setSelectedItems}) {
    let majorsFormatted = majors.map(val => ({value:val.value, label:val.value}));
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
    if (auth.user) {
        const router = useRouter();
        const [profileData, setProfileData] = useState({});
        const [old, setOld] = useState({})
        const [selectedItems, setSelectedItems] = useState([]);
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
            const majors = selectedItems.map((majorObject) => (majorObject.value)).reduce((acc, major)=>(acc + ", " + major), "").slice(2);

            setProfileData({
                name: auth.user.name,
                major: majors,
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
                        <MajorAutocomplete selectedItems={selectedItems} setSelectedItems={setSelectedItems}/>
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
