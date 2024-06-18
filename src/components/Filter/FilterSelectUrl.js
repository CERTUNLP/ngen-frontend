import React from 'react';
import { Form } from 'react-bootstrap';
import Select from 'react-select';
const FilterSelectUrl = ({ options, itemName, partOfTheUrl, itemFilter, itemFilterSetter, setLoading, setCurrentPage, value, setValue }) => {
  const getUrlNumber = (item) => {
    let itemNumber = "";
    if (item !== null) {
      const parts = item.value.split("/");
      itemNumber = parts[parts.length - 2];
      setCurrentPage(1)
      itemFilterSetter(`${partOfTheUrl}=${itemNumber}&`);

    } else {
      setCurrentPage(1)
      itemFilterSetter(`${partOfTheUrl}=${itemNumber}&`);
    }
    if (itemFilter !== `${partOfTheUrl}=${itemNumber}&`) {
      setLoading(true);
    }
    if (value) {//esto porque tengo que ver todos los filtros y agregarles el value y setValue esto solo esta en el listado de eventos por modal
      setValue(item)
    }
  };

  return (
    <Form.Group>
      <Select options={options} isClearable placeholder={`Filtrar por ${itemName}`}
        value={value} onChange={(e) => getUrlNumber(e)} />
    </Form.Group>

  );
};

export default FilterSelectUrl;