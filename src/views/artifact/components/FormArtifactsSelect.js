import React, { useEffect } from 'react';
import { Form } from 'react-bootstrap';
import {
    validateSpace, validateEmail, validateURL, validateIP, validateAutonomousSystem,
    validateUserAgent, validateFQDN, validateDomain, validateHexadecimal32,
    validateHexadecimal40, validateHexadecimal64, validateHexadecimal128
} from '../../../utils/validators';
import { useTranslation } from 'react-i18next';

const FormArtifactsSelect = (props) => {
    // props: selectedType,.value, setContact, setValidContact
    useEffect(() => {
        if (username) {
            props.setValidArtifact(!props.contact || username.condition);
        }
    }, [props.value, props.type]);


    const { t } = useTranslation();
    const typeValue = [
        {
            name: 'mail',
            placeholder: '{t("Ingrese email")}',
            isInvalid: JSON.parse(!validateSpace(props.value) || !validateEmail(props.value)),
            condition: JSON.parse(validateEmail(props.value)),
            messageDanger: '{t("Ingrese un email valido")}'

        },
        {
            name: 'domain',
            placeholder: '{t("Ingrese dominio")}',
            isInvalid: JSON.parse(!validateSpace(props.value) || !validateDomain(props.value)),
            condition: "",
            messageDanger: '{t("Ingrese un dominio valido")}'
        },
        {
            name: 'url',
            placeholder: '{t("Ingrese URI")}',
            isInvalid: JSON.parse(!validateSpace(props.value)),
            condition: "",
            messageDanger: '{t("Ingrese un URL valido")}'
        },
        {
            name: 'ip',
            placeholder: '{t("Ingrese IP")}',
            isInvalid: JSON.parse(!validateSpace(props.value) || !validateIP(props.value)),
            condition: JSON.parse(validateIP(props.value)),
            messageDanger: '{t("Ingrese una ip valida")}'
        },
        {
            name: 'autonomous-system',
            placeholder: '{t("Ingrese Número de Sistema Autónomo")}',
            isInvalid: JSON.parse(!validateSpace(props.value) || !validateAutonomousSystem(props.value)),
            condition: JSON.parse(validateAutonomousSystem(props.value)),
            messageDanger: '{t("Ingrese un número de Sistema Autónomo valido")}'
        },
        {
            name: 'user-agent',
            placeholder: '{t("Ingrese user-agent")}',
            isInvalid: JSON.parse(!validateSpace(props.value) || !validateUserAgent(props.value)),
            condition: JSON.parse(validateUserAgent(props.value)),
            messageDanger: '{t("Ingrese un user-agent valido")}'
        },
        {
            name: 'fqdn',
            placeholder: '{t("Ingrese fqdn")}',
            isInvalid: JSON.parse(!validateSpace(props.value) || !validateDomain(props.value)),
            condition: JSON.parse(validateDomain(props.value)),
            messageDanger: '{t("Ingrese un fqdn valido")}'
        },
        {
            name: 'other',
            placeholder: '{t("Ingrese Otro tipo de dato")}',
            isInvalid: JSON.parse(!validateSpace(props.value)),
            condition: "",
            messageDanger: '{t("Ingrese un URI valido")}'
        },
        {
            name: 'hash',
            placeholder: '{t("Ingrese un valor hexadecimal de 32 caracteres")}',
            isInvalid: JSON.parse(!validateSpace(props.value) || (!validateHexadecimal32(props.value) && !validateHexadecimal40(props.value)
                && !validateHexadecimal64(props.value) && !validateHexadecimal128(props.value))),
            condition: JSON.parse(validateHexadecimal32(props.value) || validateHexadecimal40(props.value)
                || validateHexadecimal64(props.value) || validateHexadecimal128(props.value)),
            messageDanger: '{t("Ingrese un hash de 32 valido")}'
        }
    ];

    const username = typeValue.find(t => t.name === props.type);


    if (username) {
        return (
            <React.Fragment>

                <Form.Group controlId="formGridAddress1">
                    <Form.Label>{t('Valor')}</Form.Label>
                    <Form.Control

                        placeholder={username.placeholder}
                        value={props.value}
                        maxlength="255"
                        onChange={(e) => { props.setValue(e.target.value) }}
                        isInvalid={username.isInvalid}
                    />

                    {!props.value || username.condition ? "" : <div className="invalid-feedback"> {username.messageDanger} </div>}
                </Form.Group>



            </React.Fragment>
        );
    }
    else {
        return (
            <React.Fragment>
                <Form.Group controlId="Form.Contact.Username.readOnly">
                    <Form.Label>{t('Valor')}</Form.Label>
                    <Form.Control readOnly
                        placeholder='{t("Aun no ha seleccionado el tipo de contacto")}'
                        name="username" />
                </Form.Group>
            </React.Fragment>
        );
    }
};

export default FormArtifactsSelect;