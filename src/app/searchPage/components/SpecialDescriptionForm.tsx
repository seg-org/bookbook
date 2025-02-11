import React, { useState, useEffect } from 'react';

const specialTypes = [
  "AUTHOR_SIGNATURE",
  "LIMITED_EDITION",
  "FIRST_EDITION",
  "SPECIAL_COVER_ART",
  "ILLUSTRATED_EDITION",
  "COLLECTORS_EDITION",
  "SLIPCASE_EDITION",
  "LEATHER_BOUND",
  "GILDED_EDGES",
  "DECKLE_EDGES",
  "POP_UP_ELEMENTS",
  "FOLD_OUT_PAGES",
  "HANDWRITTEN_NOTES_BY_AUTHOR",
  "PERSONALIZED_MESSAGE",
  "NUMBERED_EDITION",
  "EXCLUSIVE_ARTWORK",
  "EMBOSSED_COVER",
  "GOLD_FOIL_STAMPING",
  "BOX_SET",
  "ANNIVERSARY_EDITION",
  "HARDCOVER_WITH_DUST_JACKET",
  "TRANSPARENT_COVER",
  "ANNOTATED_EDITION",
  "SIGNED_BY_ILLUSTRATOR",
  "MAP_INSERT",
  "SUPPLEMENTARY_MATERIALS",
  "EXCLUSIVE_CONTENT",
  "FAN_ART_EDITION",
  "INTERACTIVE_ELEMENTS",
  "BILINGUAL_EDITION",
];

const SpecialDescriptionForm = ({ postId }) => {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [existingTypes, setExistingTypes] = useState([]);

  useEffect(() => {
    // Fetch existing special descriptions for the post
    fetch(`/api/specialDescriptions?postId=${postId}`)
      .then(response => response.json())
      .then(data => setExistingTypes(data.map(item => item.specialType)));
  }, [postId]);

  const handleCheckboxChange = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Determine which types to add and which to remove
    const typesToAdd = selectedTypes.filter(type => !existingTypes.includes(type));
    const typesToRemove = existingTypes.filter(type => !selectedTypes.includes(type));

    // Add new special descriptions
    for (const type of typesToAdd) {
      await fetch('/api/specialDescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, specialType: type }),
      });
    }

    // Remove unselected special descriptions
    for (const type of typesToRemove) {
      await fetch('/api/specialDescriptions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, specialType: type }),
      });
    }

    // Update existing types
    setExistingTypes(selectedTypes);
  };

  return (
    <form onSubmit={handleSubmit}>
      {specialTypes.map(type => (
        <div key={type}>
          <label>
            <input
              type="checkbox"
              checked={selectedTypes.includes(type)}
              onChange={() => handleCheckboxChange(type)}
            />
            {type.replace(/_/g, ' ')}
          </label>
        </div>
      ))}
      <button type="submit">Save</button>
    </form>
  );
};

export default SpecialDescriptionForm;