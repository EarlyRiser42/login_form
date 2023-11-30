import styled, { keyframes } from 'styled-components';

const Loading = ({ forComponent, isCircleAtCenter }) => {
  return forComponent ? (
    <LoadingDiv $isCircleAtCenter={isCircleAtCenter}>
      <LoadingIndicator />
    </LoadingDiv>
  ) : (
    <LoadingX>
      <img src={'./X_logo.svg'} width={'80px'} height={'80px'} />
    </LoadingX>
  );
};

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const hideLoadingScreen = keyframes`
  from {
      opacity: 1;
  }
  to {
      opacity: 0;
      visibility: hidden;
  }
`;

const LoadingX = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 232;
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  animation: ${hideLoadingScreen} 0.3s linear forwards;
  animation-delay: 0.7s;
`;

const LoadingDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: ${(props) =>
    props.$isCircleAtCenter ? 'center' : 'flex-start'};
  width: 100%;
  height: 100%;
  animation: ${hideLoadingScreen} 0.3s linear forwards;
  animation-delay: 0.5s;
`;

const LoadingIndicator = styled.div`
  margin-top: 5%;
  width: 1.2rem;
  height: 1.2rem;
  border: 3px solid #dbebfb; /* Lighter blue border */
  border-top: 3px solid #4a99e9; /* Darker blue top border */
  border-radius: 50%;
  animation: ${spin} 1s ease-in-out infinite;
`;

export default Loading;
