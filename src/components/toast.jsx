import styled from 'styled-components';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { toastTextState } from '../util/recoil.jsx';

const Toast = () => {
  const [toastText, setToastText] = useRecoilState(toastTextState);

  useEffect(() => {
    if (toastText.text) {
      console.log(toastText);
      const timer = setTimeout(() => {
        setToastText({ type: 'notice', text: '' });
      }, 2000); // reset the toast after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [toastText]);

  if (toastText.type === 'notice') {
    return <ToastNoticeDiv>{toastText.text}</ToastNoticeDiv>;
  }
  if (toastText.type === 'error') {
    return <ToastErrorDiv>{toastText.text}</ToastErrorDiv>;
  }
};

const ToastErrorDiv = styled.div`
  width: 400px;
  height: 30px;
  position: fixed;
  left: 50%;
  bottom: 50px;
  transform: translateX(-50%); /* X축 기준 중앙 정렬 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: #1d9bf0;
  border-radius: 5px;

  @media (max-width: 480px) {
    font-size: 0.8rem;
    width: 100%;
    height: 40px;
    bottom: 0px;
    border-radius: 0px;
  }
`;

const ToastNoticeDiv = styled.div`
  width: 200px;
  height: 40px;
  position: fixed;
  left: 50%;
  bottom: 50px;
  transform: translateX(-50%); /* X축 기준 중앙 정렬 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: #1d9bf0;
  border-radius: 5px;
  font-size: 0.9rem;
  @media (max-width: 500px) {
    font-size: 0.8rem;
    width: 100%;
    height: 50px;
    bottom: 0px;
    border-radius: 0px;
  }
`;

export default Toast; // 함수 선언 후 export
