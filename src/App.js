import React, { useState, useEffect } from 'react';
import Card from './components/contactCard';
import noResultIcon from './no-result-found-icon.svg';

function App() {
  //Defining variables
  const url = "https://jsonplaceholder.typicode.com/users";
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState('name');
  const [groupedData, setGroupedData] = useState({});

  // Fetching data from url and store data in variable data, also stop loading from showing
  useEffect(() => {
    const getContact = async () => {
      try {
        const response = await fetch(url);
        const res = await response.json();
        setData(res);
      } catch (error) {
        console.error('There is an error in data fetching:', error);
      } finally {
        setIsLoading(false);
      }
    };
    getContact();
  }, []);

  useEffect(() => {
    // Sorting contacts in ascending name or descending name order
    const sortedData = [...data].sort((a, b) => {
      if (a.name < b.name) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (a.name > b.name) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });

    // Filter out contacts that is not relevant to the search
    const filteredData = sortedData.filter(contact => {
      const searchTerm = searchQuery.toLowerCase();
      // Helper function to check for matches within a nested object
      const checkNestedField = (field, path) => {
        if (typeof field === 'object' && field !== null) {
          for (const key in field) {
            if (checkNestedField(field[key], path ? `${path}.${key}` : key)) {
              return true;
            }
          }
        } else {
          return field?.toString().toLowerCase().includes(searchTerm);
        }
        return false;
      };

      // Main filtering logic
      switch (searchField) {
        // ID requires exact match to show
        case 'id':
          return contact.id.toString() === searchTerm; // Exact match for ID
        case 'address':
          return checkNestedField(contact.address);
        case 'company':
          return checkNestedField(contact.company);
        default:
          return contact[searchField]?.toLowerCase().includes(searchTerm);
      }
    });

    // Grouping the contacts based on the first letter of the name
    const groups = filteredData.reduce((acc, contact) => {
      const letter = contact.name.charAt(0).toUpperCase();
      acc[letter] = acc[letter] || [];
      acc[letter].push(contact);
      return acc;
    }, {});
    setGroupedData(groups);
  }, [data, sortOrder, searchQuery, searchField]);

  // Defining the handleSort function for click on sorting function
  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="bg-white min-h-screen flex flex-col items-center py-8">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="bg-gray-100 p-8 rounded-lg shadow-lg">
          <div className="bg-gradient-to-r bg-gray-300 text-teal-600 p-4 rounded-t-lg mb-8 flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-4xl font-bold mb-4 md:mb-0">Contacts</h1>
            <div className="flex space-x-4 items-center">
              {/*Drop down list to let user show which criteria to search*/}
              <select 
                className="border rounded-md p-2 w-full md:w-48 text-gray-800"
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
              >
                <option value="name">Name</option>
                <option value="username">Username</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="website">Website</option>
                <option value="id">ID (exact match)</option>
                <option value="address">Address</option>
                <option value="company">Company</option>
              </select>
              {/*Allow user to input what to search for, input text box*/}
              <input
                type="text"
                placeholder="Search"
                className="border rounded-md p-2 w-full md:w-64 text-gray-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {/*Button to let users choose whether to show cotacts in ascending or descending name order */}
              <button
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleSort}
              >
                Sort {sortOrder === 'asc' ? 'Z-A' : 'A-Z'}
              </button>
            </div>
          </div>
          {/*Main area to show the content, if fetching data, show loading else, show the contact cards */}
          {isLoading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : (
            Object.entries(groupedData).map(([letter, contacts]) => (
              <div key={letter} className="mb-10">
                <h2 className="text-2xl font-semibold text-teal-600 mb-4">{letter}</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {contacts.map((contact, index) => (
                    <li key={index}>
                      <Card contact={contact} /> 
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
          {/**If no contacts is in contact list or no contacts meets the search*/}
          {!isLoading && Object.keys(groupedData).length === 0 && (
            <div className="flex flex-col items-center">
              <img src={noResultIcon} alt="No Results Found" class="w-12 h-12 mb-4" />
              <p>The contact book is empty.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;