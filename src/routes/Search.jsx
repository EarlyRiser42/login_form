import React, { useState, useEffect } from 'react';
import '../style/Search.css';
const Search = () => {
  const [searchWord, setSearchWord] = useState('');

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setSearchWord(value);
  };

  return (
    <div className={'SearchDiv'}>
      <div className={'SearchInputDiv'}>
        <img src={'./search.svg'} alt={'search'} />
        <input
          className={'SearchInput'}
          name="검색"
          type="text"
          placeholder="검색"
          maxLength={32}
          required
          value={searchWord}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default Search;
