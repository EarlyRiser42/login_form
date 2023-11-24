import { useInfiniteQuery } from 'react-query';
import axios from 'axios';

export const useGetMentions = ({ size, userObj, mentionPage }) =>
  useInfiniteQuery(
    ['getMentions', mentionPage],
    ({ pageParam = 0 }) => {
      const requestData = {
        following: userObj.following,
        userId: userObj.uid,
        page: pageParam,
        size,
        mentionPage,
      };
      return axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/getMentions`,
        requestData,
      );
    },
    {
      getNextPageParam: (lastPage, pages) => {
        const nextPage = lastPage.data.pageNumber + 1;
        return lastPage.data.isLastPage ? undefined : nextPage;
      },
      cacheTime: 1000 * 60 * 5, // 예: 5분
      staleTime: 1000 * 60 * 0, // 예: 1분
    },
  );
