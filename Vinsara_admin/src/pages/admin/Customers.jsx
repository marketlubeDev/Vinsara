import React, { useEffect, useState, useCallback } from "react";
import PageHeader from "../../components/Admin/PageHeader";
import { listUsers, searchUser } from "../../sevices/userApis";
import LoadingSpinner from "../../components/spinner/LoadingSpinner";
import debounce from "lodash/debounce";

function Customers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        // If search is empty, fetch normal list
        try {
          setLoading(true);
          const response = await listUsers(currentPage, 10);

          setUsers(response.data.users);
          setTotalPages(response.data.pagination.totalPages);
          setTotalUsers(response.data.pagination.totalUsers);
          setHasNextPage(response.data.pagination.hasNextPage);
          setHasPrevPage(response.data.pagination.hasPrevPage);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
        return;
      }

      // Perform search
      try {
        setLoading(true);
        const response = await searchUser(query);
        setUsers(response.data.users);
        setTotalPages(response.data.pagination.totalPages);
        setTotalUsers(response.data.pagination.totalUsers);
        setHasNextPage(response.data.pagination.hasNextPage);
        setHasPrevPage(response.data.pagination.hasPrevPage);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }, 500),
    [currentPage]
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Initial data fetch
  useEffect(() => {
    if (!searchQuery) {
      const fetchUsers = async () => {
        setLoading(true);
        try {
          const response = await listUsers(currentPage, 10);
          setUsers(response.data.users);
          setTotalPages(response.data.pagination.totalPages);
          setTotalUsers(response.data.pagination.totalUsers);
          setHasNextPage(response.data.pagination.hasNextPage);
          setHasPrevPage(response.data.pagination.hasPrevPage);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    }
  }, [currentPage, searchQuery]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="flex flex-col  bg-gray-100 ">
      <PageHeader content={"Customers"} />

      <div className="flex flex-col m-4">
        <div className="relative overflow-hidden shadow-md sm:rounded-lg flex flex-col flex-1 bg-white">
          <div className="flex items-center justify-between flex-wrap md:flex-row p-4 border-b">
            <div>
              <div
                id="dropdownAction"
                className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600"
              >
                <ul
                  className="py-1 text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="dropdownActionButton"
                >
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Reward
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Promote
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Activate account
                    </a>
                  </li>
                </ul>
                <div className="py-1">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Delete User
                  </a>
                </div>
              </div>
            </div>
            <label htmlFor="table-search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="table-search-users"
                className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search for users"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th scope="col" className="px-6 py-3 bg-gray-50">
                    User Details
                  </th>
                  <th scope="col" className="px-6 py-3 bg-gray-50">
                    Phone Number
                  </th>
                  <th scope="col" className="px-6 py-3 bg-gray-50">
                    Joined Date
                  </th>
                  <th scope="col" className="px-6 py-3 bg-gray-50">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      <LoadingSpinner
                        color="primary"
                        text="Loading users..."
                        size="sm"
                      />
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-red-500">
                      Error loading users
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user._id}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="flex items-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        <div className="ps-3">
                          <div className="text-base font-semibold">
                            {user.username}
                          </div>
                          <div className="font-normal text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{user.phonenumber || "N/A"}</td>
                      <td className="px-6 py-4">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div
                            className={`h-2.5 w-2.5 rounded-full me-2 ${
                              user.isBlocked ? "bg-red-500" : "bg-green-500"
                            }`}
                          />
                          {user.isBlocked ? "Blocked" : "Active"}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Customers;
