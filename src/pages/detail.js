import axios from "axios";
import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { baseUrl, typeColor } from "../helpers";

const Detail = ({ show, setShow, getDetailModal }) => {
  const { REACT_APP_API_URL } = process.env || {};

  const [getData, setData] = useState({});
  const [getDataDetail, setDataDetail] = useState({});
  const [getDetailEvolution, setDetailEvolution] = useState({});
  const [getDetailEvolution1, setDetailEvolution1] = useState({});
  const [getDetailEvolution2, setDetailEvolution2] = useState({});
  const [getDetailEvolution3, setDetailEvolution3] = useState({});

  const handleClose = () => setShow(false);

  useEffect(() => {
    if (Object.keys(getDetailModal).length > 0) {
      setData(getDetailModal);
    }
  }, [getDetailModal]);

  useEffect(() => {
    if (Object.keys(getData).length > 0) {
      axios
        .get(getData.species.url)
        .then(({ data: res }) => {
          if (res) {
            setDataDetail(res);
          } else {
            setDataDetail({});
          }
        })
        .catch(() => setDataDetail({}));
    }
  }, [getData]);

  useEffect(() => {
    if (Object.keys(getDataDetail).length > 0) {
      axios
        .get(getDataDetail.evolution_chain.url)
        .then(({ data: res }) => {
          if (res) {
            setDetailEvolution(res);
          } else {
            setDetailEvolution({});
          }
        })
        .catch(() => setDetailEvolution({}));
    }
  }, [getDataDetail]);

  useEffect(() => {
    if (Object.keys(getDetailEvolution).length > 0) {
      axios
        .get(
          REACT_APP_API_URL + "pokemon/" + getDetailEvolution.chain.species.name
        )
        .then(({ data: res }) => {
          if (res) {
            setDetailEvolution1(res);
          } else {
            setDetailEvolution1({});
          }
        })
        .catch(() => setDetailEvolution1({}));
      axios
        .get(
          REACT_APP_API_URL +
            "pokemon/" +
            (getDetailEvolution.chain.evolves_to[0] !== undefined
              ? getDetailEvolution.chain.evolves_to[0].species.name
              : "")
        )
        .then(({ data: res }) => {
          if (res) {
            setDetailEvolution2(res);
          } else {
            setDetailEvolution2({});
          }
        })
        .catch(() => setDetailEvolution2({}));
      axios
        .get(
          REACT_APP_API_URL +
            "pokemon/" +
            (getDetailEvolution.chain.evolves_to[0] !== undefined
              ? getDetailEvolution.chain.evolves_to[0].evolves_to[0] !==
                undefined
                ? getDetailEvolution.chain.evolves_to[0].evolves_to[0].species
                    .name
                : ""
              : "")
        )
        .then(({ data: res }) => {
          if (res) {
            setDetailEvolution3(res);
          } else {
            setDetailEvolution3({});
          }
        })
        .catch(() => setDetailEvolution3({}));
    }
  }, [REACT_APP_API_URL, getDetailEvolution]);

  return (
    <>
      <Modal className="modal-lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton className="custom-header-modal">
          <Modal.Title className="custom-title-modal">
            {" "}
            Pokedex | Detail Pokemon
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {Object.keys(getData).length > 0 && (
            <div className="row">
              <div className="col-lg-5 col-md-6 col-sm-12 col-12">
                <img
                  src={
                    getData.sprites !== undefined
                      ? getData.sprites.other.dream_world.front_default
                      : baseUrl("/img/icon.png")
                  }
                  className="thumbnail-detail"
                  alt="thumbnail"
                />
              </div>
              <div className="col-lg-7 col-md-6 col-sm-12 col-12">
                <div className="row">
                  <div className="col-12">
                    <p style={{ fontSize: "18px", fontWeight: "600" }}>
                      <span style={{ color: "#9d9d9d", fontStyle: "italic" }}>
                        {getData.id !== undefined ? "#" + getData.id : '' }
                      </span>
                      &nbsp; {getData.name !== undefined ? getData.name : ''}
                    </p>
                  </div>
                  <div className="col-12">
                    <p>
                      {getDataDetail.flavor_text_entries !== undefined
                        ? getDataDetail.flavor_text_entries[0].flavor_text
                        : "-"}
                    </p>
                  </div>
                  <div className="col-12">
                    <p style={{ fontWeight: "600" }}>Type</p>
                    {getData.types.length > 0 &&
                      getData.types.map((arr, mp) => {
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
                                padding: "5px 20px",
                                textAlign: "center",
                              }}
                            >
                              {arr.type.name}
                            </div>
                          </>
                        );
                      })}
                  </div>
                  <div className="col-12 mt-3">
                    <div className="card">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-lg-6 col-md-6 col-sm-12">
                            <span className="fw-bolder">Height</span>
                            <p>{getData.height || "-"}</p>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-12">
                            <span className="fw-bolder">Shape</span>
                            <p>
                              {getDataDetail.shape
                                ? getDataDetail.shape.name
                                : "-"}
                            </p>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-12">
                            <span className="fw-bolder">Habitat</span>
                            <p>
                              {getDataDetail.habitat
                                ? getDataDetail.habitat.name
                                : "-"}
                            </p>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-12">
                            <span className="fw-bolder">Generation</span>
                            <p>
                              {getDataDetail.generation
                                ? getDataDetail.generation.name
                                : "-"}
                            </p>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-12">
                            <span className="fw-bolder">Color</span>
                            <p>
                              {getDataDetail.color
                                ? getDataDetail.color.name
                                : "-"}
                            </p>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-12">
                            <span className="fw-bolder">Abilities</span>
                            <p>
                              {getData.abilities
                                ? getData.abilities
                                    .map(({ ability: { name } }) => name)
                                    .join(", ")
                                : "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 mt-3">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-12">
                        <p className="fw-bolder text-secondary-color">Stats</p>
                        <hr />
                      </div>
                      <div className="col-12">
                        <table className="table">
                          <thead>
                            <tr>
                              <th style={{ textAlign: 'left' }}>Stat</th>
                              <th style={{ textAlign: 'center' }}>Base Stat</th>
                              <th style={{ textAlign: 'center' }}>Effort</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.keys(getData).length > 0 &&
                              getData.stats &&
                              getData.stats.length > 0 &&
                              getData.stats.map((item, number) => (
                                <tr key={number}>
                                  <td style={{ textAlign: 'left' }}>{item.stat.name || '-' }</td>
                                  <td style={{ textAlign: 'center' }}>{item.base_stat || 0 }</td>
                                  <td style={{ textAlign: 'center' }}>{item.effort || 0 }</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 mt-3">
                <div className="card">
                  <div className="card-body">
                    <div className="row mb-3">
                      <div className="col-12 mb-3">
                        <p className="fw-bolder text-secondary-color">Evolutions</p>
                        <hr />
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12 col-12 text-center">
                        {Object.keys(getDetailEvolution3).length > 0 && (
                          <>
                            <img
                              src={
                                getDetailEvolution1.sprites !== undefined
                                  ? getDetailEvolution1.sprites.other
                                      .dream_world.front_default
                                  : baseUrl("/img/icon.png")
                              }
                              className="thumbnail-main"
                              alt="thumbnail"
                            />
                            <p
                              style={{
                                fontSize: "18px",
                                fontWeight: "600",
                                textAlign: "center",
                                marginTop: "10px",
                              }}
                            >
                              <span
                                style={{
                                  color: "#9d9d9d",
                                  fontStyle: "italic",
                                }}
                              >
                                {getDetailEvolution1.id !== undefined
                                  ? "#" + getDetailEvolution1.id
                                  : ""}
                              </span>
                              &nbsp;{" "}
                              {getDetailEvolution1.name !== undefined
                                ? getDetailEvolution1.name
                                : ""}
                            </p>
                            {getDetailEvolution1.types !== undefined &&
                              getDetailEvolution1.types.length > 0 &&
                              getDetailEvolution1.types.map((arr, mp) => {
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
                                        padding: "5px 20px",
                                        textAlign: "center",
                                      }}
                                    >
                                      {arr.type.name}
                                    </div>
                                  </>
                                );
                              })}
                          </>
                        )}
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12 col-12 text-center">
                        {Object.keys(getDetailEvolution3).length > 0 && (
                          <>
                            <img
                              src={
                                getDetailEvolution2.sprites !== undefined
                                  ? getDetailEvolution2.sprites.other
                                      .dream_world.front_default
                                  : baseUrl("/img/icon.png")
                              }
                              className="thumbnail-main"
                              alt="thumbnail"
                            />
                            <p
                              style={{
                                fontSize: "18px",
                                fontWeight: "600",
                                textAlign: "center",
                                marginTop: "10px",
                              }}
                            >
                              <span
                                style={{
                                  color: "#9d9d9d",
                                  fontStyle: "italic",
                                }}
                              >
                                {getDetailEvolution2.id !== undefined
                                  ? "#" + getDetailEvolution2.id
                                  : ""}
                              </span>
                              &nbsp;{" "}
                              {getDetailEvolution2.name !== undefined
                                ? getDetailEvolution2.name
                                : ""}
                            </p>
                            {getDetailEvolution2.types !== undefined &&
                              getDetailEvolution2.types.length > 0 &&
                              getDetailEvolution2.types.map((arr, mp) => {
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
                                        padding: "5px 20px",
                                        textAlign: "center",
                                      }}
                                    >
                                      {arr.type.name}
                                    </div>
                                  </>
                                );
                              })}
                          </>
                        )}
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12 col-12 text-center">
                        {Object.keys(getDetailEvolution3).length > 0 && (
                          <>
                            <img
                              src={
                                getDetailEvolution3.sprites !== undefined
                                  ? getDetailEvolution3.sprites.other
                                      .dream_world.front_default
                                  : (
                                    getDetailEvolution2.sprites !== undefined
                                    ? getDetailEvolution2.sprites.other
                                        .dream_world.front_default
                                    : baseUrl("/img/icon.png")
                                  )
                              }
                              className="thumbnail-main"
                              alt="thumbnail"
                            />
                            <p
                              style={{
                                fontSize: "18px",
                                fontWeight: "600",
                                textAlign: "center",
                                marginTop: "10px",
                              }}
                            >
                              <span
                                style={{
                                  color: "#9d9d9d",
                                  fontStyle: "italic",
                                }}
                              >
                                {getDetailEvolution3.id !== undefined
                                  ? "#" + getDetailEvolution3.id
                                  : (
                                    getDetailEvolution2.id !== undefined
                                  ? "#" + getDetailEvolution2.id
                                  : ""
                                  )}
                              </span>
                              &nbsp;{" "}
                              {getDetailEvolution3.name !== undefined
                                ? getDetailEvolution3.name
                                : (
                                    getDetailEvolution2.name !== undefined
                                    ? getDetailEvolution2.name
                                    : ""
                                )}
                            </p>
                            {getDetailEvolution3.types !== undefined ?
                              getDetailEvolution3.types.length > 0 &&
                              getDetailEvolution3.types.map((arr, mp) => {
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
                                        padding: "5px 20px",
                                        textAlign: "center",
                                      }}
                                    >
                                      {arr.type.name}
                                    </div>
                                  </>
                                );
                              }) : (
                                getDetailEvolution2.types !== undefined &&
                                getDetailEvolution2.types.length > 0 &&
                                getDetailEvolution2.types.map((arr, mp) => {
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
                                            padding: "5px 20px",
                                            textAlign: "center",
                                        }}
                                        >
                                        {arr.type.name}
                                        </div>
                                    </>
                                    );
                                })
                              )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export { Detail };
