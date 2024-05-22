import React, { useState } from 'react';

// Reusable Modal component, defining for the pop up window when the contact card is clicked.
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg relative" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

// ExpandableSection component, defining for the additional address and company information when the respective button is clicked.
const ExpandableSection = ({ label, content, expanded, onToggle }) => (
  <div className="mt-4">
    <button className="bg-[#9a1a42] text-white px-4 py-2 rounded" onClick={onToggle}>
      {expanded ? `Hide ${label}` : `View ${label}`}
    </button>

    {expanded && (
      <div className="mt-2">
        {content}
      </div>
    )}
  </div>
);

// Defining the contact card
const Card = ({ contact }) => {
  // Defining variables
  const [showModal, setShowModal] = useState(false);
  const [showCompany, setShowCompany] = useState(false);
  const [showAddress, setShowAddress] = useState(false);

  return (
    <div>
      {/* Initial Card (Click to open modal) */}
      <div
        className="my-4 mx-auto w-64 max-w-xs bg-gradient-to-r bg-[#9a1a42] shadow-lg rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105"
        onClick={() => setShowModal(true)}
      >
        <div className="flex p-4 flex-col items-start">
          <h3 className="text-white text-lg font-semibold whitespace-nowrap">{contact.id}</h3>
          <h2 className="text-white text-lg font-semibold whitespace-nowrap overflow-hidden overflow-ellipsis">
            {contact.name} 
          </h2>
        </div>
      </div>

      {/* Modal (Appears when showModal is true) */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl"
          onClick={() => setShowModal(false)}
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold text-[#9a1a42]">{contact.name}</h2>
        <p className="mt-2 text-gray-700">ID: {contact.id}</p>
        <hr></hr>
        <p className="text-gray-700">Username: {contact.username}</p>
        <hr></hr>
        <p className="text-gray-700">Email: {contact.email}</p>
        <hr></hr>
        <p className="text-gray-700">Phone: {contact.phone}</p>
        <hr></hr>
        <p className="text-gray-700">Website: {contact.website}</p>
        <hr></hr>
        {/* Expandable Sections */}
        <ExpandableSection
          label="Company"
          expanded={showCompany}
          onToggle={() => setShowCompany(!showCompany)}
          content={
            <>
              <h3 className="font-semibold">Company Name: {contact.company.name}</h3>
              <hr></hr>
              <p>Company Catchphrase: {contact.company.catchPhrase}</p>
              <hr></hr>
              <p>Business Summary: {contact.company.bs}</p>
              <hr></hr>
            </>
          }
        />

        <ExpandableSection
          label="Address"
          expanded={showAddress}
          onToggle={() => setShowAddress(!showAddress)}
          content={
            <>
              <p>{contact.address.suite}, {contact.address.street}</p>
              <p>{contact.address.city}, {contact.address.zipcode}</p>
              <hr></hr>
              <p>Latitude: {contact.address.geo.lat}</p>
              <p>Longitude: {contact.address.geo.lng}</p>
              <hr></hr>
            </>
          }
        />
      </Modal>
    </div>
  );
};

export default Card;