import React, { useContext, useEffect, useState } from 'react'
import { Flex, Button, ScaleFade } from '@chakra-ui/react'
import Head from 'next/head'

import Configs from './configs'
import Instructions from './instructions'

import { Container } from './styles'
import { GameContext } from '../../context/GameContext'
import WithSoundEffects from '../../components/WithSoundEffects'
import Credits from './credits'
import Play from './play'
import Store from '../../util/store'
import Sound from '../../gui/Sound'

const HomeView: React.FC = () => {
  const [screen, setScreen] = useState(-1)
  const handleChangeScreen = index => setScreen(index)

  const options = [
    {
      key: 'play',
      label: 'Jogar',
      content: <Play handle={handleChangeScreen} />
    },
    {
      key: 'instructions',
      label: 'Como Jogar',
      content: <Instructions handle={handleChangeScreen} />
    },
    {
      key: 'credits',
      label: 'Créditos',
      content: <Credits handle={handleChangeScreen} />
    },
    {
      key: 'settings',
      label: 'Configurações',
      content: <Configs handle={handleChangeScreen} />
    }
  ]

  useEffect(() => {
    Store.get('game@username', Store.randomStr(7))
    Store.get('game@bgm', 100)
    Store.get('game@effects', 100)
    const bgmAudio = new Sound('/sounds/bg-home3.mp3', true, true)
    bgmAudio.setVolume(Store.get('game@bgm', 100))
    Store.observe('game@bgm', val => {
      bgmAudio.setVolume(val)
    })
    document.body.addEventListener('click', function () {
      try {
        bgmAudio.play()
      } catch {
        // To-do
      }
    })
  }, [])

  return (
    <>
      <Head>
        <title>
          Pegação - {screen !== -1 ? options[screen].label : 'Inicio'}
        </title>
      </Head>
      <Container>
        <ScaleFade initialScale={0.9} in={screen === -1}>
          {screen === -1 && (
            <Flex align="center" justify="center">
              <Flex
                mx="auto"
                direction="column"
                maxWidth="1140px"
                p="8"
                height="100vh"
                pt="3rem"
              >
                <img src="/img/logo.png" />
                <Flex direction="column" flex="1" justify="center">
                  {options.map((option, i) => (
                    <WithSoundEffects key={option.key}>
                      <Button
                        variant="unstyled"
                        size="lg"
                        height="4rem"
                        key={option.key}
                        onClick={e => {
                          handleChangeScreen(i)
                        }}
                        cursor="pointer"
                        fontSize="3xl"
                        _hover={{
                          color: 'pink.500',
                          backgroundColor: 'gray.900'
                        }}
                      >
                        {option.label}
                      </Button>
                    </WithSoundEffects>
                  ))}
                </Flex>
              </Flex>
            </Flex>
          )}
        </ScaleFade>
        <ScaleFade initialScale={0.9} in={!!options[screen]}>
          {options[screen] && options[screen].content}
        </ScaleFade>
      </Container>
    </>
  )
}

export default HomeView
