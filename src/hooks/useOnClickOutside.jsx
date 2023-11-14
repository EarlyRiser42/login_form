import { useEffect } from 'react';

export default function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (e) => {
      /* 클릭 시 모달 창 안이면 */
      if (!ref.current || ref.current.contains(e.target)) return;
      // 모달 바깥을 클릭했으므로 handler 함수 호출
      handler();
    };

    // mousedown 및 touchstart 이벤트를 사용하여 외부 클릭 감지
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      // 컴포넌트 언마운트 시에 이벤트 리스너 제거
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
