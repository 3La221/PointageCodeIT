import React from 'react';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

// Define the keyframes for the spinning animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Styled component for the loader
const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #4f5d75;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${spin} 1s linear infinite;
`;

// Styled component for centering the loader
const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Loader = () => (
  <LoaderContainer>
    <Spinner />
  </LoaderContainer>
);

export default Loader;
