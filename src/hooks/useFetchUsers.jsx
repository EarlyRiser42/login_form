import { useInfiniteQuery } from 'react-query';
import axios from 'axios';

export const useFetchUsers = ({ size, userObj, followingPage }) =>
  useInfiniteQuery(
    ['getTweets', followingPage],
    ({ pageParam = 0 }) => {
      const requestData = {
        following: userObj.following,
        userId: userObj.uid,
        followingPage,
        page: pageParam,
        size,
      };
      return axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/getTweets`,
        requestData,
      );
    },
    {
      getNextPageParam: (lastPage, pages) => {
        // 새로운 페이지 인덱스를 계산하여 반환
        const nextPage = lastPage.data.pageNumber + 1;
        return lastPage.data.isLastPage ? undefined : nextPage;
      },
    },
  );
