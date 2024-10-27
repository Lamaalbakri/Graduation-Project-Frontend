import React, { useEffect, useState } from "react";
import "./ViewMaterials.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { fetchAllCurrentRequests } from "../../../../api/manageRawMaterialApi";
import { Modal } from "antd";
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
  };

  useEffect(() => {
    const getRequests = async () => {
      try {
        const requests = await fetchAllCurrentRequests();
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

    const suppliers = [...new Set(material.map((item) => item.supplier))];
    setUniqueSupplier(suppliers);
    console.log(suppliers);
  }, [material]);

  const handlePriceFilter = (range) => {
    setSelectedPriceRange(range);
  };

  const handleMaterialFilter = (slug) => {
    setSelectedMaterial(slug);
  };

  const handleSupplierFilter = (supplier) => {
    setSelectedSupplier(supplier);
  };

  const priceRanges = [
    { label: "$0-$50", min: 0, max: 50 },
    { label: "$51-$100", min: 51, max: 100 },
    { label: "$101-$200", min: 101, max: 200 },
    { label: "$201-$500", min: 201, max: 500 },
    { label: "$501 or more", min: 501, max: 99999 },
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
      return item.supplier === selectedSupplier;
    })
    .filter((item) => {
      if (!selectedMaterial) return true;
      return item.slug === selectedMaterial;
    });

  return (
    <>
      <main className="main">
        <div className="content">
          <div className="header">
            <div className="filters" onClick={() => setIsFilterOpen(true)}>
              <FontAwesomeIcon icon={faFilter} />
              Filters
            </div>

            <Modal
              title="Filter"
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
            >
              <div className="filter-modal">
                <div>
                  <p className="filter-header">Prices</p>
                  {priceRanges.map((range) => (
                    <p
                      key={range.label}
                      className="grey-text pointer"
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
                      className="grey-text pointer"
                      onClick={() => handleSupplierFilter(sup)}
                    >
                      {sup}
                    </p>
                  ))}
                </div>
                <div>
                  <p className="filter-header">Material</p>
                  {uniqueSlugs.map((slug, index) => (
                    <p
                      key={index}
                      className="grey-text pointer"
                      onClick={() => handleMaterialFilter(slug)}
                    >
                      {slug}
                    </p>
                  ))}
                </div>
              </div>
            </Modal>

            <div className="search">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
              <input
                type="text"
                placeholder="Search for items..."
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
