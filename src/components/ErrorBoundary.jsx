import { PropsWithChildren } from 'react';
import { useQueryErrorResetBoundary } from 'react-query';
import { ErrorBoundary } from 'react-error-boundary';

const Retry = ({ handleRetry }) => (
  <div>
    <p> 데이터를 불러오는데 실패하였습니다. </p>
    <button onClick={handleRetry}> 다시 시도 </button>
  </div>
);

export default Retry;
