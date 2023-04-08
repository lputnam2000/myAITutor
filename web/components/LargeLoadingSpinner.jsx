import styled, {keyframes} from 'styled-components'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;
const Spinner = styled.div`
  height: 100%;
  position: relative;
  display: inline-block;
  width: 4rem;
  height: 4rem;
  border: 0.4rem solid #57657e;
  border-left-color: #4585fc;
  border-radius: 50%;
  animation: ${rotate} 1.2s linear infinite;

  &::before {
    content: "⚡";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.5rem;
  }
`;

const Container = styled.div`
  width: 100%;
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
`


export const LargeLoadingSpinner = () => {
    return (<Container>
            <Spinner/>
        </Container>
    )
}

export default LargeLoadingSpinner;