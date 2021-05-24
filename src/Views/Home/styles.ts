import styled from 'styled-components'

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  z-index: 2;
`

export const SideMenu = styled.div`
  transform: scale3d(1, 1, 1) rotateX(0deg) rotateY(60deg) rotateZ(0deg)
    translate3d(0px, 0px, 0px) skew(0deg, 0deg);
  position: relative;
  width: 350px;
  height: 100vh;

  section {
    width: 350px;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 20px 10px;
    transform: translateZ(175px);
    img,
    figure {
      width: 180px;
      height: auto;
      margin-top: 20px;
    }
    ul {
      flex: 1;
      margin: 0;
      list-style: none;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      li {
        width: 100%;
        color: #fff;
        -webkit-font-smoothing: antialiased;
        cursor: pointer;
        padding: 8px 12px;
        font-size: 28pt;
        transition: all ease-in-out 0.3s;
        &:hover {
          transform: rotateY(-15deg);
          background-color: rgba(248, 49, 255);
        }
      }
    }
  }
`

export const SideMenuWrapper = styled.aside`
  perspective: 1000px;
  perspective-origin: 50% 50%;
`
