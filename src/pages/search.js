import axios from "axios";
import { baseUrl } from "../helpers";
import React, { useCallback, useState } from "react";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";

const CACHE = {};
const PER_PAGE = 10;
const { REACT_APP_API_URL } = process.env || {};

const Search = ({ onSelected }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [query, setQuery] = useState("");

  const makeAndHandleRequest = () => {
    return axios
      .get(REACT_APP_API_URL + `pokemon?limit=${100000}&offset=${0}`)
      .then(({ data: { results, count } }) => {
        const options = results.map((item, index) => ({
          avatar_url: baseUrl("/img/icon.png"),
          id: index,
          name: item.name,
        }));
        return { options, total_count: count };
      });
  };

  const handleInputChange = (q) => {
    setQuery(q);
  };

  const handlePagination = (e, shownResults) => {
    const cachedQuery = CACHE[query];

    if (
      cachedQuery.options.length > shownResults ||
      cachedQuery.options.length === cachedQuery.total_count
    ) {
      return;
    }

    setIsLoading(true);

    const page = cachedQuery.page + 1;

    makeAndHandleRequest().then((resp) => {
      const options = cachedQuery.options.concat(resp.options);
      CACHE[query] = { ...cachedQuery, options, page };

      setIsLoading(false);
      setOptions(options);
    });
  };

  const handleSearch = useCallback((q) => {
    if (CACHE[q]) {
      setOptions(CACHE[q].options);
      return;
    }

    setIsLoading(true);
    makeAndHandleRequest().then((resp) => {
      CACHE[q] = { ...resp, page: 1 };

      setIsLoading(false);
      setOptions(resp.options);
    });
  }, []);

  const handleSelected = (res) => {
    onSelected(res.length > 0 ? res[0].name : "");
  };

  return (
    <AsyncTypeahead
      id="async-pagination-example"
      isLoading={isLoading}
      labelKey="name"
      maxResults={PER_PAGE - 1}
      minLength={2}
      onInputChange={handleInputChange}
      onPaginate={handlePagination}
      onSearch={handleSearch}
      onChange={handleSelected}
      options={options}
      paginate
      placeholder="Search Pokemon..."
      renderMenuItemChildren={(option) => (
        <div key={option.id}>
          <img
            alt={option.name}
            src={option.avatar_url}
            style={{
              height: "24px",
              marginRight: "10px",
              width: "24px",
            }}
          />
          <span>{option.name}</span>
        </div>
      )}
      useCache={false}
    />
  );
};

export { Search };