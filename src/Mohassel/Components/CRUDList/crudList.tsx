import React, { useEffect, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Loader } from '../../../Shared/Components/Loader';
import * as local from '../../../Shared/Assets/ar.json';

interface Option {
    name: string;
    disabledUi: boolean;
    id: string;
    activated: boolean;
}
interface Props {
    source: string;
    options: Array<Option>;
    newOption: Function;
    updateOption: Function;
}
interface State {
    options: Array<Option>;
    loading: boolean;
    filterOptions: string;
    temp: Array<string>;
    source: string;
}
export const CRUDList = (props: Props) => {
    const [options, setOptions] = useState<Array<Option>>(props.options);
    const [filterOptions, setFilterOptions] = useState('');
    const [temp, setTemp] = useState<Array<Option>>(props.options);
    useEffect(() => {
        setOptions(props.options);
        setTemp(props.options)
    }, [props.options]);
    function addOption() {
        if (!options.some(option => option.name === "")) {
            setOptions([{ name: "", disabledUi: false, id: "", activated: true }, ...options]);
            setFilterOptions('');
            setTemp([{ name: "", disabledUi: false, id: "", activated: true }, ...temp])
        }
    }
    function handleChangeInput(event: React.ChangeEvent<HTMLInputElement>, index: number) {
        setOptions(options.map((option, optionIndex) => optionIndex === index ? { ...option, name: event.currentTarget.value } : option))
    }
    function toggleClick(index: number, submit: boolean) {
        if (options[index].disabledUi === false && options[index].name.trim() !== "" && submit) {
            if (options[index].id === "") {
                //New 
                props.newOption(options[index].name, options[index].activated, index);
            } else {
                //Edit 
                props.updateOption(options[index].id, options[index].name, options[index].activated, index);
            }
        } else if (!submit) {
            const optionsTemp = [...options];
            optionsTemp[index].disabledUi = !options[index].disabledUi;
            setOptions(optionsTemp)
        }
    }
    function handleKeyDown(event: React.KeyboardEvent, index: number) {
        if (event.key === 'Enter') {
            toggleClick(index, true)
        }
    }
    function reset(index) {
        const optionsTemp = [...options];
        optionsTemp[index] = { ...temp[index], disabledUi: true };
        setOptions(optionsTemp)
    }
    return (

        <Container style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', textAlign: 'center', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                <Form.Control
                    type="text"
                    data-qc="filterOptions"
                    placeholder={local.search}
                    maxLength={100}
                    value={filterOptions}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterOptions(e.currentTarget.value)}
                />
                <span
                    onClick={() => addOption()}
                    style={{ margin: 'auto 20px', color: '#7dc356', cursor: 'pointer' }}
                >
                    <img alt="addOption" src={require('../../Assets/plus.svg')} />
                </span>
            </div>
            <ListGroup style={{ textAlign: 'right', width: '30%', marginBottom: 30 }}>
                {options
                    .filter(option => option.name.toLocaleLowerCase().includes(filterOptions.toLocaleLowerCase()))
                    .map((option, index) => {
                        return (
                            <ListGroup.Item key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                <Form.Group style={{ margin: '0px 0px 0px 20px' }}>
                                    <Form.Control
                                        type="text"
                                        data-qc="loanUsageInput"
                                        maxLength={100}
                                        title={option.name}
                                        value={option.name}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, index)}
                                        onKeyDown={(e: React.KeyboardEvent) => handleKeyDown(e, index)}
                                        disabled={option.disabledUi}
                                        style={option.disabledUi ? { background: 'none', border: 'none' } : {}}
                                        isInvalid={options[index].name.trim() === ""}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {local.required}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                {option.disabledUi ?
                                    <span
                                        style={option.activated ? { color: '#7dc356', marginLeft: 20 } : { color: '#d51b1b', marginLeft: 20 }}
                                        className={option.activated ? "fa fa-check-circle fa-lg" : "fa fa-times-circle fa-lg"} />
                                    :
                                    <>
                                        <Form.Check
                                            type="checkbox"
                                            data-qc={`activate${index}`}
                                            label={local.active}
                                            className="checkbox-label"
                                            checked={options[index].activated}
                                            onChange={() => setOptions(options.map((option, optionIndex) => optionIndex === index ? { ...option, activated: !options[index].activated } : option))}
                                        />
                                        <span className="fa fa-undo fa-lg"
                                            style={{ color: '#7dc356', cursor: 'pointer', marginLeft: 20 }}
                                            onClick={() => temp[index].name !== '' ? reset(index) : setOptions(options.filter(loanItem => loanItem.id !== ""))}
                                        />
                                    </>
                                }
                                <span
                                    onClick={() => option.disabledUi ? toggleClick(index, false) : toggleClick(index, true)}
                                    style={{ color: '#7dc356', cursor: 'pointer', marginLeft: 20 }}
                                    data-qc="editSaveIcon">
                                    <img alt={option.disabledUi ? 'edit' : 'save'} src={option.disabledUi ? require('../../Assets/editIcon.svg') : require('../../Assets/save.svg')} />
                                </span>
                            </ListGroup.Item>
                        )
                    })}
            </ListGroup>
        </Container>
    );
}