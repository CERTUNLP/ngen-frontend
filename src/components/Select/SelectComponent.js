import React from 'react';
import { Form } from 'react-bootstrap';
import Select from 'react-select';

const SelectComponent = ({ controlId, label, options, nameField, value, onChange, placeholder, required, setOption}) => {
    return (
            <Form.Group controlId={controlId}>
                <Form.Label>{label} {required ? <b style={{color:"red"}}>*</b> : ""}</Form.Label>
                    <Select options={options} value={value} isClearable placeholder={placeholder} onChange={(e)=>onChange(nameField, e, setOption)}
                />
            </Form.Group>
    );
};

export default SelectComponent;
