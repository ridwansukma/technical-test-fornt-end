import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { baseUrl, typeColor } from "../helpers";
import { Search } from './search'

const Index = () => {
  const [getLimit] = useState(20);
  const [getOffset] = useState(0);
  const [getUrlNext, setUrlNext] = useState("");
  const [getDetail, setDetail] = useState([]);
  const [getSearch, setSearch] = useState("");
  const { REACT_APP_API_URL } = process.env || {};

  const getDetailDataNext = async (res) => {
    const posts = res.map((item) => {
      return axios
        .get(item.url)
        .then((res) => res.data)
        .catch((e) => console.error(e));
    });
    Promise.all(posts).then((res) => setDetail((prev) => [...prev, ...res]));
  };

  const loadMore = useCallback(() => {
    axios.get(getUrlNext).then(({ data: { results: res, next } }) => {
      if (res) {
        setUrlNext(next);
        getDetailDataNext(res);
      }
    });
  }, [getUrlNext]);

  const getDetailData = async (res) => {
    const posts = res.map((item) => {
      return axios
        .get(item.url)
        .then((res) => res.data)
        .catch((e) => console.error(e));
    });
    Promise.all(posts).then((res) => setDetail(res));
  };

  const handleScroll = useCallback(() => {
    const bottom =
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.scrollHeight;
    if (bottom) {
      loadMore();
    }
  }, [loadMore]);

  const handleSearch = () => {
    axios.get(REACT_APP_API_URL + 'pokemon/' + getSearch).then(({data: res}) => {
      if (res) {
        setDetail([res])
      }
    });
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    axios
      .get(REACT_APP_API_URL + `pokemon?limit=${getLimit}&offset=${getOffset}`)
      .then(({ data: { results: res, next } }) => {
        if (res) {
          setUrlNext(next);
          getDetailData(res);
        }
      });
  }, [REACT_APP_API_URL, getLimit, getOffset]);

  useEffect(() => {
    if( getSearch !== '' ) {
      setTimeout(() => {
        axios.get(REACT_APP_API_URL + 'pokemon/' + getSearch).then(({data: res}) => {
          if (res) {
            setDetail([res])
          }
        })
      }, 500);
    }
  }, [REACT_APP_API_URL, getSearch])

  return (
    <>
      <div className="container pt-3">
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-12 div-logo">
                <img
                  src={baseUrl("/img/logo.svg")}
                  alt="logo"
                  className="main-logo"
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg-2 col-md-12 col-sm-12 ">&nbsp;</div>
              <div className="col-lg-6 col-md-10 col-sm-9 col-7">
                <Search onSelected={setSearch} />
              </div>
              <div className="col-lg-2 col-md-2 col-sm-3 col-5">
                <button
                  type="button"
                  className="btn btn-sm btn-warning btn-block btn-primary-color btn-search"
                  onClick={handleSearch}
                >
                  <i className="fa fa-search"></i>&nbsp; Search
                </button>
              </div>
              <div className="col-lg-2 col-md-12 col-sm-12 ">&nbsp;</div>
            </div>
            <div className="row mt-3">
              {getDetail.map((item, keys) => {
                return (
                  <>
                    <div
                      className="col-lg-3 col-md-6 col-sm-12 mb-3"
                      key={keys}
                      id={"main" + keys}
                    >
                      <div
                        key={"child-" + keys}
                        className="card card-main"
                        onClick={() => {
                          console.log("url");
                        }}
                      >
                        <div className="card-body div-main">
                          <img
                            src={
                              item.sprites.other.dream_world.front_default || baseUrl("/img/icon.png")
                            }
                            className="thumbnail-main"
                            alt="thumbnail"
                          />
                          <p className="mt-3 fw-bolder">
                            <span className="order">#{item.id}</span> &nbsp;
                            {item.name}
                          </p>
                          {item.types.map((arr, mp) => {
                            let styleAttribute = typeColor(arr.type.name);
                            return (
                              <>
                                <div
                                  key={mp}
                                  style={{
                                    backgroundColor: `${styleAttribute.bg}`,
                                    color: `${styleAttribute.color}`,
                                    border: `1px solid ${styleAttribute.border}`,
                                    borderRadius: "20px",
                                    width: "47%",
                                    float: "left",
                                    margin: "0px 1.5%",
                                    fontWeight: 600
                                  }}
                                >
                                  {arr.type.name}
                                </div>
                              </>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}

              {getDetail.length >= 20 && (
                <div className="col-lg-12 col-md-12 col-sm-12 my-5">
                  <button
                    className="btn btn-secondary btn-block btn-load-more"
                    onClick={loadMore}
                  >
                    Load More...
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { Index };
