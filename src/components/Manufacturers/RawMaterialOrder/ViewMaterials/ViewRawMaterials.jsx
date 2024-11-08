import React, { useEffect, useState } from "react";
import "./ViewMaterials.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { fetchMaterialForListOfSupplier } from "../../../../api/manageRawMaterialApi";
import { Modal, Button } from "antd";
import ProductCard from "./ProductCard";

const ViewRawMaterials = () => {
  const [material, setMaterial] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [uniqueSlugs, setUniqueSlugs] = useState([]);
  const [uniqueSupplier, setUniqueSupplier] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const handleCancel = () => {
    setIsFilterOpen(false);
    setSelectedPriceRange(null);
    setSelectedSupplier(null);
    setSelectedMaterial(null);
  };

  useEffect(() => {
    const getRequests = async () => {
      try {
        const requests = await fetchMaterialForListOfSupplier();
        setMaterial(requests);

        console.log(requests);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
    getRequests();
  }, []);

  useEffect(() => {
    const slugs = [...new Set(material.map((item) => item.slug))];
    setUniqueSlugs(slugs);
    console.log(slugs);

    const suppliers = [
      ...new Set(material.map((item) => item.supplierId?.full_name)),
    ];
    setUniqueSupplier(suppliers);
    console.log(suppliers);
  }, [material]);

  const handlePriceFilter = (range) => {
    setSelectedPriceRange(range);
  };

  // const handleMaterialFilter = (slug) => {
  //   setSelectedMaterial(slug);
  // };

  const handleSupplierFilter = (supplier) => {
    setSelectedSupplier(supplier);
  };

  const priceRanges = [
    { label: "0 - 50 SAR", min: 0, max: 50 },
    { label: "51 - 100 SAR", min: 51, max: 100 },
    { label: "101 - 200 SAR", min: 101, max: 200 },
    { label: "201 - 500 SAR", min: 201, max: 500 },
    { label: "501 SAR or more", min: 501, max: 99999 },
  ];

  const filteredMaterials = material
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
      if (!selectedSupplier) return true;
      return item?.supplierId?.full_name === selectedSupplier;
    });
  // .filter((item) => {
  //   if (!selectedMaterial) return true;
  //   return item.slug === selectedMaterial;
  // });

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
                <span>
                  <FontAwesomeIcon
                    icon={faFilter}
                    style={{ marginRight: "8px" }}
                  />
                  Filter
                </span>
              }
              open={isFilterOpen}
              onCancel={handleCancel}
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
                    fontSize: "14px", // تعديل الحجم
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
                  Clear Filter
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
                  <p className="filter-header">Supplier</p>
                  {uniqueSupplier.map((sup, index) => (
                    <p
                      key={index}
                      className={`pointer ${
                        sup === selectedSupplier ? "filterActive" : "grey-text"
                      }`}
                      onClick={() => handleSupplierFilter(sup)}
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
            {filteredMaterials.map((d) => (
              <ProductCard key={d._id} d={d} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default ViewRawMaterials;
