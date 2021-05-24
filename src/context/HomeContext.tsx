import React, { createContext, useContext, useEffect } from 'react'
import { Container } from 'pixi.js'
import { GameContext } from './GameContext'
interface HomeContextProps {
  main: Container
  menu: Container
  bg: Container
}

export const HomeContext = createContext(({} as unknown) as HomeContextProps)

const HomeContextProvider: React.FC = ({ children }) => {
  const { app } = useContext(GameContext)

  const bg = new Container()
  const menu = new Container()
  const main = new Container()

  useEffect(() => {
    main.addChild(bg)
    main.addChild(menu)
    app.stage.addChild(main)
  }, [])

  return (
    <HomeContext.Provider value={{ bg, main, menu }}>
      {children}
    </HomeContext.Provider>
  )
}

export default HomeContextProvider
