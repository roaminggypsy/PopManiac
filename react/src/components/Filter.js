import React from 'react';

// Define a default UI for filtering
export function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}

// This is a custom filter UI for selecting
// a unique option from a list
export function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows

  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      if (id === 'favorite') {
        options.add('true');
      } else {
        options.add(row.values[id]);
      }
    });
    return [...options.values()];
  }, [id, preFilteredRows]);
  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      style={{ width: '20px' }}
    >
      <option value=''>All</option>
      {options.map((option, i) =>
        option === null ? null : (
          <option key={i} value={option}>
            {option === 'true' ? 'Favorite' : option}
          </option>
        )
      )}
    </select>
  );
}
