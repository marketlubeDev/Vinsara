import React, { useState, useEffect } from "react";

const ProductTableHeader = ({
  onSelectAll,
  selectedProducts,
  products,
  currentPage,
}) => {
  const [isAllSelected, setIsAllSelected] = useState(false);

  useEffect(() => {
    const currentProductIds = products.map((product) => product._id);
    const isAllCurrentSelected = currentProductIds.every((id) =>
      selectedProducts?.includes(id)
    );
    setIsAllSelected(isAllCurrentSelected);
  }, [selectedProducts, products]);

  return (
    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" className="p-4">
          <div className="flex items-center">
            <input
              id="checkbox-all-search"
              type="checkbox"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              // onChange={onSelectAll}
              onChange={(e) => onSelectAll(e, currentPage)}
              checked={isAllSelected}
            />
            <label htmlFor="checkbox-all-search" className="sr-only">
              checkbox
            </label>
          </div>
        </th>
        <th scope="col" className="px-6 py-3">
          Product name
        </th>
       

        <th scope="col" className="px-6 py-3">
          Category
        </th>
        <th scope="col" className="px-6 py-3">
          Status
        </th>
        <th scope="col" className="px-6 py-3">
          Last Updated
        </th>

        <th scope="col" className="px-6 py-3">
          Actions
        </th>
      </tr>
    </thead>
  );
};

export default ProductTableHeader;
