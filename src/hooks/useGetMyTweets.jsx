import { useInfiniteQuery } from 'react-query';
import axios from 'axios';

export const useGetMyTweets = ({ size, userInfo, pageName }) =>
  useInfiniteQuery(
    ['getTweets', userInfo],
    ({ pageParam = 0 }) => {
      const requestData = {
        userId: userInfo.uid,
        pageName: pageName,
        page: pageParam,
        likes: userInfo.likes,
        size,
      };
      return axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/getMyTweets`,
        requestData,
      );
    },
    {
      getNextPageParam: (lastPage, pages) => {
        const nextPage = lastPage.data.pageNumber + 1;
        return lastPage.data.isLastPage ? undefined : nextPage;
      },
    },
  );
