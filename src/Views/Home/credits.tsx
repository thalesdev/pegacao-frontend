import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  IconButton,
  List,
  ListItem,
  ListIcon,
  SlideFade,
  useDisclosure,
  Text,
  ScaleFade,
  SimpleGrid,
  Avatar
} from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { FiCheckSquare } from 'react-icons/fi'

import WithSoundEffects from '../../components/WithSoundEffects'

// import styles from './configs.module.scss'
// import { Container } from './styles'

interface ConfigProps {
  handle: CallableFunction
}
const Credits: React.FC<ConfigProps> = ({ handle }) => {
  const { isOpen, onOpen } = useDisclosure()

  const team = [
    { name: 'Prícilla Karen', git: 'PriSuzano' },
    { name: 'Rita Carolina', git: 'ritaalamino' },
    { name: 'Thales de Oliveira', git: 'thalesdev' },
    { name: 'Thayllor dos Santos ', git: 'thayllor' },
    { name: 'Wanderson Paes', git: 'wandersonpaes' }
  ]

  useEffect(() => {
    const t = setTimeout(() => onOpen(), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <Flex align="center" justify="center">
      <Flex mx="auto" direction="column" maxWidth="1140px" p="8" height="100vh">
        <Stack spacing="3rem" justify="center" align="center">
          <Heading>Créditos</Heading>
          <Flex flex="1">
            <SimpleGrid spacing={4} columns={2}>
              {team.map(({ git, name }) => (
                <ScaleFade key={git} in={isOpen}>
                  <Stack
                    bg="pink.500"
                    p="8"
                    justify="center"
                    align="center"
                    direction="row"
                    spacing="4"
                    borderRadius="10px"
                    cursor="pointer"
                    _hover={{
                      bg: 'pink.600'
                    }}
                    as="a"
                    href={`https://github.com/${git}`}
                    target="_blank"
                  >
                    <Avatar
                      size="lg"
                      name={name}
                      src={`https://github.com/${git}.png`}
                    />
                    <Heading as="h3">{name}</Heading>
                  </Stack>
                </ScaleFade>
              ))}
            </SimpleGrid>
          </Flex>
          <WithSoundEffects>
            <IconButton
              onClick={e => handle(-1)}
              aria-label="Botão de voltar"
              variant="link"
              icon={<img src="/img/back_button.svg" alt="Botão de voltar" />}
            />
          </WithSoundEffects>
        </Stack>
      </Flex>
    </Flex>
  )
}

export default Credits
