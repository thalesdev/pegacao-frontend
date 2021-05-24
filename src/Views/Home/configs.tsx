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
  IconButton
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { GiMusicSpell } from 'react-icons/gi'
import { BsMusicNoteBeamed } from 'react-icons/bs'

import Store from '../../util/store'
import WithSoundEffects from '../../components/WithSoundEffects'

// import styles from './configs.module.scss'
// import { Container } from './styles'

interface ConfigProps {
  handle: CallableFunction
}
const Configs: React.FC<ConfigProps> = ({ handle }) => {
  const [username, setUsername] = useState(
    Store.get('game@username', Store.randomStr(7))
  )
  const [BGM, setBGM] = useState(Store.get('game@bgm', 100))
  const [effects, setEffects] = useState(Store.get('game@effects', 100))

  useEffect(() => {
    if (username) {
      Store.set('game@username', username)
    }
  }, [username])
  useEffect(() => {
    if (BGM) {
      Store.set('game@bgm', BGM)
    }
  }, [BGM])

  useEffect(() => {
    if (effects) {
      Store.set('game@effects', effects)
    }
  }, [effects])

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
        <Heading>Configurações</Heading>
        <Flex
          direction="column"
          spacing="3"
          flex="1"
          align="center"
          justify="start"
          py="4rem"
        >
          <Stack spacing="8">
            <FormControl id="bgm">
              <FormLabel fontSize="xl" mb="3">
                Volume da Musica de Fundo
              </FormLabel>
              <Slider
                aria-label="slider-ex-4"
                defaultValue={Store.get('game@bgm', 100)}
                onChangeEnd={val => setBGM(val)}
                h="20px"
              >
                <SliderTrack bg="red.100" h="20px">
                  <SliderFilledTrack bg="pink.500" h="20px" />
                </SliderTrack>
                <SliderThumb boxSize={8}>
                  <Box color="tomato" as={GiMusicSpell} />
                </SliderThumb>
              </Slider>
            </FormControl>
            <FormControl id="efeitos">
              <FormLabel fontSize="xl" mb="3">
                Volume dos Efeitos
              </FormLabel>
              <Slider
                aria-label="slider-ex-4"
                defaultValue={Store.get('game@effects', 100)}
                onChange={val => setEffects(val)}
                h="20px"
                min={0}
                max={100}
              >
                <SliderTrack bg="red.100" h="20px">
                  <SliderFilledTrack bg="pink.500" h="20px" />
                </SliderTrack>
                <SliderThumb boxSize={8}>
                  <Box color="tomato" as={BsMusicNoteBeamed} />
                </SliderThumb>
              </Slider>
            </FormControl>
            <FormControl id="apelido">
              <FormLabel fontSize="xl" mb="3">
                Apelido
              </FormLabel>
              <Input
                type="text"
                value={username}
                onChange={e =>
                  setUsername(e.target.value.replace(/[^\w]/gi, ''))
                }
                maxLength={16}
                minLength={3}
                focusBorderColor="pink.500"
                bg="gray.900"
                variant="filled"
                _hover={{ bgColor: 'gray.900' }}
                _focus={{ bgColor: 'gray.700' }}
                size="lg"
              />
            </FormControl>
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

export default Configs
