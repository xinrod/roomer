import { FormLabel } from '@chakra-ui/form-control'
import { Input } from '@chakra-ui/input'
import { Flex } from '@chakra-ui/layout'
import { SliderThumb } from '@chakra-ui/slider'
import { SliderFilledTrack } from '@chakra-ui/slider'
import { SliderTrack } from '@chakra-ui/slider'
import { Slider } from '@chakra-ui/slider'
import React from 'react'
import { formatAmountForDisplay } from '../utils/stripe/stripe-helpers'

type Props = {
  name: string
  value: number
  min: number
  max: number
  currency: string
  step: number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
}

const CustomDonationInput = ({
  name,
  value,
  min,
  max,
  currency,
  step,
  onChange,
  className,
}: Props) => (
  <Flex direction="row" my={4} w="100%">
    <FormLabel>
      Custom donation amount ({formatAmountForDisplay(min, currency)}-
    {formatAmountForDisplay(max, currency)}):
      <Flex direction="column" w="100%">
        <Input
          className={className}
          type="number"
          name={name}
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={onChange}
          mb={6}
          w={["300px", "85vw"]}
          maxW="700px"
          borderColor="gray.300"
        ></Input>
        <Input
          type="range"
          name={name}
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={onChange}
          bg="purple.200"
          height="8px"
          p={-3}
          borderColor="gray.400"
        ></Input>
      </Flex>
    </FormLabel>
  </Flex>
)

export default CustomDonationInput