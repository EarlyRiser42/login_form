import styled from 'styled-components';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { toastTextState } from '../util/recoil.jsx';

const Toast = () => {
  const [toastText, setToastText] = useRecoilState(toastTextState);

  useEffect(() => {
    if (toastText) {
      console.log(toastText);
      const timer = setTimeout(() => {
        setToastText('');
      }, 1000); // reset the error after 3 seconds

      return () => clearTimeout(timer); // Clear the timer if the component unmounts
    }
  }, []); // 종속성 배열에 text 추가

  return <ToastDiv>{toastText}</ToastDiv>;
};

const ToastDiv = styled.div`
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

export default Toast; // 함수 선언 후 export
