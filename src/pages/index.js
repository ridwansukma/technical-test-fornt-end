import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { baseUrl, typeColor } from "../helpers";
import { Search } from "./search";
import { Filter } from "./filter";
import { Detail } from "./detail";

const Index = () => {
  const { REACT_APP_API_URL } = process.env || {};

  const [getLimit] = useState(20);
  const [getOffset] = useState(0);
  const [getUrlNext, setUrlNext] = useState("");
  const [getDetail, setDetail] = useState([]);
  const [getDetailModal, setDetailModal] = useState([]);
  const [getSearch, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [getUrlFilter, setUrlFilter] = useState({
    url: "",
    params: "",
  });

  const handleShow = () => setShow(true);

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
    if (bottom && getUrlFilter.url === "") {
      loadMore();
    }
  }, [loadMore, getUrlFilter]);

  const handleSearch = () => {
    if (getSearch !== "") {
      axios
        .get(REACT_APP_API_URL + "pokemon/" + getSearch)
        .then(({ data: res }) => {
          if (res) {
            setDetail([res]);
          }
        });
    } else {
      axios
        .get(
          REACT_APP_API_URL + `pokemon?limit=${getLimit}&offset=${getOffset}`
        )
        .then(({ data: { results: res, next } }) => {
          if (res) {
            setUrlNext(next);
            getDetailData(res);
          }
        });
    }
  };

  const handleDetail = (name) => {
    if (name !== '') {
      axios
        .get(REACT_APP_API_URL + "pokemon/" + name)
        .then(({ data: res }) => {
          if (res) {
            setDetailModal(res);
            setShowDetail(true);
          }
        })
        .catch(() => setDetailModal({}));
    } else {
      setDetailModal({});
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    if (getSearch !== "") {
      setTimeout(() => {
        axios
          .get(REACT_APP_API_URL + "pokemon/" + getSearch)
          .then(({ data: res }) => {
            if (res) {
              setDetail([res]);
            }
          });
      }, 500);
    } else {
      axios
        .get(
          REACT_APP_API_URL + `pokemon?limit=${getLimit}&offset=${getOffset}`
        )
        .then(({ data: { results: res, next } }) => {
          if (res) {
            setUrlNext(next);
            getDetailData(res);
          }
        });
    }
  }, [REACT_APP_API_URL, getSearch, getLimit, getOffset]);

  const getDetailDataFilter = async (res, type, url) => {
    console.log("res", res);
    const posts = res.map((item) => {
      let params =
        type === "pokemon-color" ||
        type === "pokemon-shape" ||
        type === "pokemon-habitat"
          ? item.name
          : item.pokemon.name;
      return (
        axios
          .get(url + "pokemon/" + params)
          .then((res) => res.data || {})
          .catch(() => {}) || {}
      );
    });

    console.log("posts", posts);
    Promise.all(posts).then((res) => {
      let dataRes = [];
      res.forEach((item) => {
        if (item !== undefined) {
          dataRes.push(item);
        }
      });
      console.log("dataRes", dataRes);
      setDetail(dataRes);
    });
  };

  useEffect(() => {
    console.log("getUrlFilter", getUrlFilter.params);
    if (getUrlFilter.url !== "") {
      axios
        .get(
          REACT_APP_API_URL +
            (getUrlFilter.url || "") +
            "/" +
            (getUrlFilter.params || "")
        )
        .then(({ data }) => {
          console.log("data", data);
          if (
            getUrlFilter.url === "pokemon-color" ||
            getUrlFilter.url === "pokemon-shape" ||
            getUrlFilter.url === "pokemon-habitat"
          ) {
            getDetailDataFilter(
              data.pokemon_species,
              getUrlFilter.url,
              REACT_APP_API_URL
            );
          } else if (
            getUrlFilter.url === "ability" ||
            getUrlFilter.url === "type"
          ) {
            getDetailDataFilter(
              data.pokemon,
              getUrlFilter.url,
              REACT_APP_API_URL
            );
          }
        });
    }
  }, [getUrlFilter, REACT_APP_API_URL]);

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
              <div className="col-lg-5 col-md-9 col-sm-8 col-6">
                <Search onSelected={setSearch} />
              </div>
              <div className="col-lg-3 col-md-3 col-sm-4 col-6">
                <button
                  type="button"
                  className="btn btn-sm btn-warning btn-block btn-primary-color me-2 btn-search"
                  onClick={handleSearch}
                >
                  <i className="fa fa-search"></i>&nbsp; Search
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-primary btn-block btn-secondary-color btn-search"
                  onClick={handleShow}
                >
                  <i className="fa fa-filter"></i>&nbsp; Filter
                </button>
              </div>
              <div className="col-lg-2 col-md-12 col-sm-12 ">&nbsp;</div>
            </div>
            <div className="row mt-3">
              {getDetail && getDetail.length > 0 ? (
                getDetail.map((item, number) => (
                  <div
                    className="col-lg-3 col-md-6 col-sm-12 mb-3"
                    key={number}
                  >
                    <div
                      className="card card-main"
                      onClick={() => handleDetail(item.name)}
                    >
                      <div className="card-body div-main">
                        <img
                          src={
                            item.sprites.other.dream_world.front_default ||
                            baseUrl("/img/icon.png")
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
                                  fontWeight: 600,
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
                ))
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    margin: "30px 0px",
                  }}
                >
                  <img
                    src={baseUrl("img/icon.png")}
                    alt="icon"
                    style={{
                      width: "100px",
                      marginBottom: "20px",
                      opacity: "0.5",
                    }}
                  />
                  <p
                    style={{
                      fontSize: "18px",
                      fontWeight: "400",
                      color: "#757575",
                    }}
                  >
                    Data Empty !
                  </p>
                </div>
              )}

              {(getDetail.length >= 20 || getUrlFilter.url !== "") && (
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
            <div className="row mt-5">
              <div className="col-12 footer">
                <p>2022 &copy; Ridwan Sukma</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Filter show={show} setShow={setShow} setUrlFilter={setUrlFilter} />
      <Detail show={showDetail} setShow={setShowDetail} getDetailModal={getDetailModal}/>
    </>
  );
};

export { Index };
