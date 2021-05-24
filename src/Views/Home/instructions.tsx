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
  ScaleFade
} from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { FiCheckSquare } from 'react-icons/fi'

import WithSoundEffects from '../../components/WithSoundEffects'

// import styles from './configs.module.scss'
// import { Container } from './styles'

interface ConfigProps {
  handle: CallableFunction
}
const Instructions: React.FC<ConfigProps> = ({ handle }) => {
  const { isOpen, onOpen } = useDisclosure()

  useEffect(() => {
    const t = setTimeout(() => onOpen(), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <Flex align="center" justify="center">
      <Flex
        mx="auto"
        direction="column"
        maxWidth="1140px"
        p="8"
        height="100vh"
        pt="3rem"
      >
        <Heading>Como Jogar</Heading>
        <Flex
          direction="column"
          spacing="3"
          flex="1"
          align="center"
          justify="center"
          py="4rem"
        >
          <Stack spacing="8">
            <SlideFade in={isOpen} offsetX="-50px" offsetY="-20px">
              <List spacing={3} fontSize="2xl">
                <ListItem>
                  <ListIcon as={FiCheckSquare} color="white" />
                  Monte sua sala ou entre em uma já criada!
                </ListItem>
                <ListItem>
                  <ListIcon as={FiCheckSquare} color="white" />O dono da sala
                  iniciará o jogo!
                </ListItem>
                <ListItem>
                  <ListIcon as={FiCheckSquare} color="white" />
                  Se divirta com seus amigos!
                </ListItem>
              </List>
            </SlideFade>
            <ScaleFade in={isOpen} initialScale={0.8}>
              <List fontSize="3xl">
                <ListItem>
                  <Text as="u">Pegador</Text>: procure nas salas e dentro dos{' '}
                  <br />
                  móveis os escondedores e encontre o máximo que puder!
                </ListItem>
                <ListItem>
                  <Text as="u">Escondedor</Text>: se esconda nas salas e dentro{' '}
                  <br />
                  dos móveis para o pegador não te encontrar, se tiver coragem
                  vá
                  <br />
                  até o save point e se salve!
                </ListItem>
              </List>
            </ScaleFade>
          </Stack>
        </Flex>

        <WithSoundEffects>
          <IconButton
            onClick={e => handle(-1)}
            aria-label="Botão de voltar"
            variant="link"
            icon={<img src="/img/back_button.svg" alt="Botão de voltar" />}
          />
        </WithSoundEffects>
      </Flex>
    </Flex>
  )
}

export default Instructions
