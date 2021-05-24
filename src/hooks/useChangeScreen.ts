import { Container, filters } from 'pixi.js'
import { useCallback, useContext, useEffect, useState } from 'react'
import { GameContext } from '../context/GameContext'
import Screen from '../gui/Screen'

export default function useChangeScreen(
  screenDefault: Container | Screen,
  parent: Container
) {
  const { app, enableWarpedSpeed } = useContext(GameContext)

  const blurOutFilter = new filters.BlurFilter()
  const blurInFilter = new filters.BlurFilter()
  const switchMaxBlur = 20
  const enterContainerAnimationTime = 750
  const [enableToEnterInContainer, setEnableToEnterInContainer] = useState(true)
  const [inSwitchContainers, setInSwitchContainers] = useState(false)
  const [switchTime, setSwitchTime] = useState(0)
  const [switchContainers, setSwitchContainers] = useState<
    [Container | Screen, Screen | Container]
  >([null, null])
  const [activeContainer, setActiveContainer] = useState(screenDefault)
  const [oldActiveContainer, setOldActiveContainer] = useState(screenDefault)

  function enableFiltersSwitchContainers() {
    const [current, target] = switchContainers

    const currentObj = ((current instanceof Screen
      ? current.container
      : current) as unknown) as any
    const targetObj = ((target instanceof Screen
      ? target.container
      : target) as unknown) as any
    if (currentObj && targetObj) {
      currentObj.children = currentObj.children.map(el => {
        el.filters = [blurOutFilter]
        return el
      })

      targetObj.children = targetObj.children.map(el => {
        el.filters = [blurInFilter]
        return el
      })
    }
  }

  function disableFiltersSwitchContainers() {
    const [current, target] = switchContainers

    const currentObj = ((current instanceof Screen
      ? current.container
      : current) as unknown) as any
    const targetObj = ((target instanceof Screen
      ? target.container
      : target) as unknown) as any
    if (currentObj && targetObj) {
      currentObj.children = currentObj.children.map(el => {
        el.filters = []
        return el
      })

      targetObj.children = targetObj.children.map(el => {
        el.filters = []
        return el
      })
    }
  }

  const tick = useCallback(
    delta => {
      if (inSwitchContainers) {
        const tempSwitchTime =
          switchTime + app.ticker.elapsedMS < enterContainerAnimationTime
            ? switchTime + app.ticker.elapsedMS
            : enterContainerAnimationTime
        setSwitchTime(tempSwitchTime)
        const progress = tempSwitchTime / enterContainerAnimationTime
        // preciso estudar melhor essa animação
        blurInFilter.blur = 0
        blurOutFilter.blur = 0
        // blurOutFilter.blur = (progress <= .5 ? progress * 2 : 1) * switchMaxBlur;
        // blurInFilter.blur = (progress >= .5 ? 2 - progress * 2 : 0) * switchMaxBlur;
        const [current, target] = switchContainers
        const currentAlpha = progress <= 0.5 ? 1 - progress * 2 : 0
        const targetAlpha = progress <= 0.5 ? progress * 2 : 1
        if (target instanceof Screen) {
          target.container.alpha = targetAlpha
        } else {
          target.alpha = targetAlpha
        }
        if (current instanceof Screen) {
          current.container.alpha = currentAlpha
        } else {
          current.alpha = currentAlpha
        }
      }
    },
    [switchTime, switchContainers, app]
  )

  const change = (panel: Container | Screen) => {
    if (enableToEnterInContainer) {
      setEnableToEnterInContainer(false)
      setInSwitchContainers(true)
      if (panel instanceof Screen) {
        panel.container.alpha = 0
        panel.draw()
      } else {
        panel.alpha = 0
        parent.addChild(panel)
      }
      if (oldActiveContainer instanceof Screen) {
        oldActiveContainer.container.alpha = 1
      } else {
        oldActiveContainer.alpha = 1
      }
      setOldActiveContainer(activeContainer)
      setActiveContainer(panel)
      setSwitchContainers([oldActiveContainer, panel])
      enableFiltersSwitchContainers()
      enableWarpedSpeed()
      const t = setTimeout(() => {
        if (oldActiveContainer) {
          if (oldActiveContainer instanceof Screen) {
            oldActiveContainer.container.parent.removeChild(
              oldActiveContainer.container
            )
          } else {
            oldActiveContainer.parent.removeChild(oldActiveContainer)
          }
        }
        setEnableToEnterInContainer(true)
        setInSwitchContainers(false)
        setSwitchTime(0)
        disableFiltersSwitchContainers()
        setSwitchContainers([null, null])
      }, enterContainerAnimationTime)
    }
  }
  useEffect(() => {
    app.ticker.add(tick)
    return () => app.ticker.remove(tick)
  }, [])

  useEffect(() => {
    app.ticker.add(tick)
    return () => app.ticker.remove(tick)
  }, [switchTime, switchContainers, app])
  return change
}
