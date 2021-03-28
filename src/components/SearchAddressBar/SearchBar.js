import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import BounceLoader from 'react-spinners/BounceLoader';
import { apiURL } from '../config';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { shortenString } from '../utils';
import { localStorage } from 'src/utils/localStorage';

import './SearchBar.scss';

const searchStorage = localStorage('addressSearchHistory');

function SearchBar(props) {
  const { inNav } = props;
  const [isActive, setActive] = useState(false);

  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [redirect, setRedirect] = useState(null);
  const [searchSuggestion, setSearchSuggestion] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const searchHistory = searchStorage.get();
  if (searchHistory === null) {
    searchHistory = '[]';
  }

  searchHistory = JSON.parse(searchHistory);

  const search = (item) => {
    //setSearching(true); -- Uncomment this to enable loading animation
    if (item === '') {
      alert('No address was specified.');
      return;
    }
    axios
      .get(apiURL + '/miner/locateAddress', { params: { address: item } })
      .then((resp) => {
        setSearching(false);
        if (resp.data.result === null) {
          alert(
            'Specified address was not found in our system. Try waiting some time if you are already mining.'
          );
          return;
        }
        var searchHistory = localStorage.getItem('addressSearchHistory');
        if (searchHistory === null) {
          searchHistory = '[]';
        }

        searchHistory = JSON.parse(searchHistory);

        searchHistory = searchHistory.filter(function (value) {
          return value !== item;
        });

        searchHistory.push(item);

        if (searchHistory.length > 3) searchHistory.shift();

        localStorage.setItem(
          'addressSearchHistory',
          JSON.stringify(searchHistory)
        );

        setRedirect(
          <Redirect to={`/miner/${resp.data.result}/${item}/stats`} />
        );
      });
  };

  return (
    <div
      className={
        'search-bar-wrapper' +
        (props.className !== undefined ? ' ' + props.className : '') +
        (isActive ? ' active' : '')
      }
    >
      <div
        className="search-bar-group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          if (!isFocused) setActive(false);
        }}
      >
        <div className={'search-bar' + (isActive ? ' active' : '')}>
          <input
            type="text"
            placeholder="Search by your mining address"
            autoComplete="chrome-off"
            className={
              (props.className === undefined
                ? 'search-bar-input'
                : `search-bar-input ${props.className}`) +
              (searchHistory.length > 0 ? ' with-suggestions' : '')
            }
            spellCheck="false"
            onFocus={() => {
              setIsFocused(true);
              setActive(true);
            }}
            onBlur={() => {
              setIsFocused(false);
              if (isHovering) return;
              setActive(false);
            }}
            value={searchSuggestion ? searchSuggestion : query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.target.blur();
              } else if (e.key === 'Enter') {
                search(query);
              }
            }}
          />
        </div>
        {searchHistory.length > 0 && isActive ? (
          <div
            className={'suggestions' + (isActive ? ' active' : '')}
            onMouseLeave={() => setSearchSuggestion(null)}
          >
            {searchHistory.map((item) => {
              return (
                <a
                  className="suggestion mono"
                  key={item}
                  onMouseEnter={() => setSearchSuggestion(item)}
                  onClick={() => search(item)}
                >
                  {inNav ? shortenString(item, 10) : item}
                </a>
              );
            })}
          </div>
        ) : null}
      </div>
      <div className="search-button">
        <button onClick={() => search(query)}>
          {searching ? (
            <div
              style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <BounceLoader color={'#fff'} size={25} />
            </div>
          ) : (
            <FaSearch />
          )}
        </button>
      </div>
      {redirect}
    </div>
  );
}

export default SearchBar;
