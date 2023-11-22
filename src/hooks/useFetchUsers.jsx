import { useInfiniteQuery } from 'react-query';
import axios from 'axios';

export const useFetchUsers = ({ size, userObj, followingPage }) =>
  useInfiniteQuery(['getTweets', followingPage], ({ pageParam = 0 }) => {
    const requestData = {
      following: userObj.following,
      userId: userObj.uid,
      followingPage,
      page: pageParam,
      size,
    };
    axios.post(
      `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/getTweets`,
      requestData,
    ),
      {
        getNextPageParam: ({ data: { isLastPage, pageNumber } }) =>
          isLastPage ? undefined : pageNumber + 1,
      };
  });
