import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { fetchGoodsForListOfDistributor } from "../../../../api/manageDistributorGoodsAPI";
import { Modal, Button } from "antd";
import ProductCardRetailers from "./ProductCardRetailers";

const ViewGoods = () => {
  const [goods, setGoods] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [uniqueSlugs, setUniqueSlugs] = useState([]);
  const [uniqueDistributor, setUniqueDistributor] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [selectedDistributor, setSelectedDistributor] = useState(null);
  const [selectedGoods, setSelectedGoods] = useState(null);

  const handleCancel = () => {
    setIsFilterOpen(false);
    setSelectedPriceRange(null);
    setSelectedDistributor(null);
    setSelectedGoods(null);
  };

  useEffect(() => {
    const getRequests = async () => {
      try {
        const requests = await fetchGoodsForListOfDistributor();
        setGoods(requests);

        console.log(requests);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
    getRequests();
  }, []);

  useEffect(() => {
    const slugs = [...new Set(goods.map((item) => item.slug))];
    setUniqueSlugs(slugs);
    console.log(slugs);

    const distributors = [
      ...new Set(goods.map((item) => item.distributorId?.full_name)),
    ];
    setUniqueDistributor(distributors);
    console.log(distributors);
  }, [goods]);

  const handlePriceFilter = (range) => {
    setSelectedPriceRange(range);
  };

  const handleDistributorFilter = (manufacturer) => {
    setSelectedDistributor(manufacturer);
  };

  const priceRanges = [
    { label: "0 - 50 SAR", min: 0, max: 50 },
    { label: "51 - 100 SAR", min: 51, max: 100 },
    { label: "101 - 200 SAR", min: 101, max: 200 },
    { label: "201 - 500 SAR", min: 201, max: 500 },
    { label: "501 SAR or more", min: 501, max: 99999 },
  ];

  const filteredGoods = goods
    .filter((item) => {
      const term = searchTerm.toLowerCase().trim();
      return (
        item.name.toLowerCase().includes(term) ||
        item.shortId.toLowerCase().includes(term)
      );
    })
    .filter((item) => {
      if (!selectedPriceRange) return true;
      const { min, max } = selectedPriceRange;
      return item.price >= min && item.price <= max;
    })
    .filter((item) => {
      if (!selectedDistributor) return true;
      return item?.distributorId?.full_name === selectedDistributor;
    });

  return (
    <>
      <main className="main">
        <div className="content-raw">
          <div className="header">
            <div className="filters" onClick={() => setIsFilterOpen(true)}>
              <FontAwesomeIcon icon={faFilter} />
              Filters
            </div>

            <Modal
              title={
                <span style={{ fontSize: "20px" }}>
                  <FontAwesomeIcon
                    icon={faFilter}
                    style={{ marginRight: "8px" }}
                  />
                  Filter
                </span>
              }
              open={isFilterOpen}
              onCancel={handleCancel}
              className="custom-filter-modal"
              okButtonProps={{
                hidden: true,
                ghost: true,
              }}
              cancelButtonProps={{
                hidden: true,
                ghost: true,
              }}
              footer={[
                <Button
                  key="clearFilter"
                  onClick={handleCancel}
                  style={{
                    backgroundColor: "white",
                    borderColor: "#1c2229",
                    color: "#1c2229",
                    fontSize: "14px",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = "#f4d53f";
                    e.currentTarget.style.color = "#f4d53f";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = "#1c2229";
                    e.currentTarget.style.color = "#1c2229";
                  }}
                >
                  Clear
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  onClick={() => setIsFilterOpen(false)}
                  className="filter-custom-button"
                >
                  OK
                </Button>,
              ]}
            >
              <div className="filter-modal-raw">
                <div>
                  <p className="filter-header">Prices</p>
                  {priceRanges.map((range) => (
                    <p
                      key={range.label}
                      className={`pointer ${
                        range.label === selectedPriceRange?.label
                          ? "filterActive"
                          : "grey-text"
                      }`}
                      onClick={() => handlePriceFilter(range)}
                    >
                      {range.label}
                    </p>
                  ))}
                </div>
                <div>
                  <p className="filter-header">Distributor</p>
                  {uniqueDistributor.map((sup, index) => (
                    <p
                      key={index}
                      className={`pointer ${
                        sup === selectedDistributor
                          ? "filterActive"
                          : "grey-text"
                      }`}
                      onClick={() => handleDistributorFilter(sup)}
                    >
                      {sup}
                    </p>
                  ))}
                </div>
              </div>
            </Modal>
            <div className="search-raw">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
              <input
                type="text"
                placeholder="Search by Name / ID"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="cardContainer">
            {filteredGoods.map((d) => (
              <ProductCardRetailers key={d._id} d={d} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default ViewGoods;
