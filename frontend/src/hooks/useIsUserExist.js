import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

export const useIsUserExist = (value) => {
  const isEmail = value.includes('@');
  const queryParam = isEmail ? `email=${value}` : `id=${value}`;
  const url = `http://localhost:3000/api/checkEmailOrId?${queryParam}`;

  const { isLoading, error, data } = useQuery(['repoData', value], () =>
    fetch(url).then((res) => res.json()),
  );

  return { isLoading, error, data };
};
