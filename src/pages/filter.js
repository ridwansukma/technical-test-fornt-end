import axios from "axios";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const Filter = ({ show, setShow, setUrlFilter }) => {
  const handleClose = () => setShow(false);
  const [getFilter, setFilter] = useState("");
  const [getAttribute, setAttribute] = useState("");
  const [getDataFilter, setDataFilter] = useState([]);
  const [loadingFilter, setLoadingFilter] = useState(true);
  const { REACT_APP_API_URL } = process.env || {};

  useEffect(() => {
    if (getFilter !== "") {
      setLoadingFilter(false);
      axios
        .get(REACT_APP_API_URL + getFilter)
        .then(({ data: { results: res } }) => {
          if (res) {
            setLoadingFilter(true);
            setDataFilter(res);
          } else {
            setLoadingFilter(true);
          }
        })
        .catch(() => setLoadingFilter(true));
    }
  }, [getFilter, REACT_APP_API_URL]);

  const handleFilter = () => {
    setShow(false);
    setUrlFilter({
      url: getFilter,
      params: getAttribute,
    });
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton className="custom-header-modal">
          <Modal.Title className="custom-title-modal">
            Filter Pokedex
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-12">
              <label className="fw-bolder mb-2">Filter By</label>
              <select
                className="form-control"
                defaultValue={""}
                onChange={({ target }) => setFilter(target.value || "")}
              >
                <option value="" selected disabled>
                  Select Filter
                </option>
                <option value="type">Pokemon Types</option>
                <option value="ability">Pokemon Ability</option>
                <option value="pokemon-habitat">Pokemon Habitat</option>
                <option value="pokemon-shape">Pokemon Shape</option>
                <option value="pokemon-color">Pokemon Color</option>
              </select>
            </div>

            <div className="col-12 mt-3 mb-2">
              <label className="fw-bolder mb-2">Attribute</label>
              {loadingFilter && (
                <select
                  className="form-control"
                  defaultValue={""}
                  onChange={({ target }) => setAttribute(target.value || "")}
                >
                  <option value="" selected disabled>
                    Select Attribute
                  </option>
                  {getDataFilter &&
                    getDataFilter.length > 0 &&
                    getDataFilter.map((item) => (
                      <option value={item.name}>{item.name}</option>
                    ))}
                </select>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleFilter}
            disabled={getFilter !== "" && getAttribute !== "" ? false : true}
          >
            Filter
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export { Filter };