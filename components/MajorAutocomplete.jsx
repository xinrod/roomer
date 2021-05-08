import React from 'react'
import { CUIAutoComplete } from 'chakra-ui-autocomplete'
import { majors } from '../pages/profile/majors';
import { FormControl } from '@chakra-ui/form-control';



export default function MajorAutocomplete() {
  let majorsFormatted = majors.map(val => ({value:val.value, label:val.value}));
  const [pickerItems, setPickerItems] = React.useState(majorsFormatted);
  const [selectedItems, setSelectedItems] = React.useState([]);

  const handleCreateItem = (item) => {
    setPickerItems((curr) => [...curr, item]);
    setSelectedItems((curr) => [...curr, item]);
  };

  const handleSelectedItemsChange = (selectedItems) => {
    if (selectedItems) {
      setSelectedItems(selectedItems);
    }
  };

  return (
    <FormControl id="major">
        <CUIAutoComplete
          label="Enter your Majors"
          placeholder="Type a major"
          onCreateItem={handleCreateItem}
          items={pickerItems}
          selectedItems={selectedItems}
          onSelectedItemsChange={(changes) =>
            handleSelectedItemsChange(changes.selectedItems)
          }
        />
        </FormControl>
  );
}