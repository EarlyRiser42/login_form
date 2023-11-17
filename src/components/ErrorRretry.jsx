import { useQueryClient } from 'react-query';
import React from 'react';
import styled from 'styled-components';

const ErrorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-top: 20px;
`;

const ErrorMessage = styled.span`
  display: block;
  margin-top: 15px;
  margin-bottom: 10px;
  color: #666;
  font-size: 14px;
`;

const RetryButton = styled.button`
  background-color: #4a99e9;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 22%;
  height: 40px;
  min-width: 140px;
  margin-top: 15px;
  border-radius: 20px;
  cursor: pointer;
  color: white;
  font-size: 16px;
  font-weight: bold;
  &:hover {
    background-color: #198cd8;
  }
  img {
    margin-right: 10px;
    width: 30px;
    height: 30px;
  }
  span {
    margin-right: 10px;
  }
`;

const ErrorRetry = ({ queryKey }) => {
  const queryClient = useQueryClient();
  const handleRetry = () => {
    queryClient.refetchQueries(queryKey);
  };

  return (
    <ErrorWrapper>
      <ErrorMessage>무언가 잘못 됐습니다. 화면을 다시 시작하세요.</ErrorMessage>
      <RetryButton onClick={handleRetry}>
        <img src={'./retry.png'} alt={'다시 시도'} />
        <span>다시 시도</span>
      </RetryButton>
    </ErrorWrapper>
  );
};

export default ErrorRetry;
