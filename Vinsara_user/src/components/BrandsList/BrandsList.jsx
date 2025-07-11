import React from 'react';
import { Link } from 'react-router-dom';


const BrandsList = ({ isOpen }) => {
  const brandsData = {
    topBrands: [
      { name: 'Nike', description: 'Lorem Ipsum Dolor Sit Amet' },
      { name: 'Adidas', description: 'Lorem Ipsum Dolor Sit Amet' },
      { name: 'Asics', description: 'Lorem Ipsum Dolor Sit Amet' },
      { name: 'Gucci', description: 'Lorem Ipsum Dolor Sit Amet' },
      { name: 'Louis Vuitton', description: 'Lorem Ipsum Dolor Sit Amet' },
    ],
    bestSelling: [
      { name: 'Nike', description: 'Lorem Ipsum Dolor Sit Amet' },
      { name: 'Adidas', description: 'Lorem Ipsum Dolor Sit Amet' },
      { name: 'Asics', description: 'Lorem Ipsum Dolor Sit Amet' },
      { name: 'Gucci', description: 'Lorem Ipsum Dolor Sit Amet' },
      { name: 'Louis Vuitton', description: 'Lorem Ipsum Dolor Sit Amet' },
    ],
    customerFavorite: [
      { name: 'Nike', description: 'Lorem Ipsum Dolor Sit Amet' },
      { name: 'Adidas', description: 'Lorem Ipsum Dolor Sit Amet' },
      { name: 'Asics', description: 'Lorem Ipsum Dolor Sit Amet' },
      { name: 'Gucci', description: 'Lorem Ipsum Dolor Sit Amet' },
      { name: 'Louis Vuitton', description: 'Lorem Ipsum Dolor Sit Amet' },
    ],
    featured: [
      { name: 'Nike', description: 'Lorem Ipsum Dolor Sit Amet' },
      { name: 'Adidas', description: 'Lorem Ipsum Dolor Sit Amet' },
      { name: 'Asics', description: 'Lorem Ipsum Dolor Sit Amet' },
      { name: 'Gucci', description: 'Lorem Ipsum Dolor Sit Amet' },
      { name: 'Louis Vuitton', description: 'Lorem Ipsum Dolor Sit Amet' },
    ],
  };

  return (
    <div className={`brands-list ${isOpen ? 'open' : ''}`}>
      <div className="brands-container">
        <div className="brands-section">
          <h3>Top Brands</h3>
          <ul>
            {brandsData.topBrands.map((brand, index) => (
              <li key={index}>
                <h4>{brand.name}</h4>
                <p>{brand.description}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="brands-section">
          <h3>Best Selling</h3>
          <ul>
            {brandsData.bestSelling.map((brand, index) => (
              <li key={index}>
                <h4>{brand.name}</h4>
                <p>{brand.description}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="brands-section">
          <h3>Customer Favorite</h3>
          <ul>
            {brandsData.customerFavorite.map((brand, index) => (
              <li key={index}>
                <h4>{brand.name}</h4>
                <p>{brand.description}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="brands-section">
          <h3>Featured</h3>
          <ul>
            {brandsData.featured.map((brand, index) => (
              <li key={index}>
                <h4>{brand.name}</h4>
                <p>{brand.description}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="shop-all">
          <h3>Shop All Brands</h3>
          <Link to="/brands" className="shop-now-btn">
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BrandsList;