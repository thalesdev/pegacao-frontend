import React from 'react'
import dynamic from 'next/dynamic'
import { Container } from '../styles/pages/Home'

const GameContextProvider = dynamic(() => import('../context/GameContext'), {
  ssr: false
})

const Stage = dynamic(() => import('../components/Stage'), {
  ssr: false
})
const Background = dynamic(() => import('../components/Background'), {
  ssr: false
})

const HomeView = dynamic(() => import('../Views/Home'), {
  ssr: false
})

const Home: React.FC = () => {
  return (
    <Container>
      <GameContextProvider>
        <Stage>
          <Background />
        </Stage>
        <HomeView />
      </GameContextProvider>
    </Container>
  )
}

export default Home
