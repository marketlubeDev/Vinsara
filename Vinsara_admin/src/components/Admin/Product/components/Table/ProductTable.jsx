import React from "react";
import ProductTableHeader from "./ProductTableHeader";
import ProductTableRow from "./ProductTableRow";

const ProductTable = ({
  products,
  onSelectAll,
  selectedProducts,
  setSelectedProducts,
  role,
  selectedProductsCount,
  currentPage,
  refetchProducts,
}) => (
  <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
    <div className="pb-4 bg-white dark:bg-gray-900"></div>
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <ProductTableHeader
        onSelectAll={onSelectAll}
        selectedProductsCount={selectedProductsCount}
        products={products}
        currentPage={currentPage}
        selectedProducts={selectedProducts}
      />
      <tbody>
        {products?.map((product) => (
          <ProductTableRow
            key={product._id}
            product={product}
            onSelectAll={onSelectAll}
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
            role={role}
            refetchProducts={refetchProducts}
          />
        ))}
      </tbody>
    </table>
  </div>
);

export default ProductTable;
