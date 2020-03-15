import React, { Component } from 'react';
import { Formik } from 'formik';
import { getBirthdateFromNationalId, getGenderFromNationalId } from '../../Services/nationalIdValidation';
import { step1, step2, step3 } from './customerFormIntialState';

interface Props { };
interface State {
  step: number,
  country: string,
}

class CustomerCreation extends Component<Props, State>{
  constructor(props: any) {
    super(props);
    this.state = {
      step: 1,
      country: 'eg',

    }
  }
  // handleChange(e: React.FormEvent<HTMLInputElement> | React.FormEvent<HTMLSelectElement>, setFieldValue: any) {
  //     const { name, value } = e.currentTarget;
  //     if (name === 'nationalIdNumber' && value.length === 14) {
  //         this.setState(prevState => ({
  //             birthDate: getBirthdateFromNationalId(value),
  //             gender: getGenderFromNationalId(value)
  //         }));
  //     }
  //     this.setState({ [name]: value } as any, () => console.log(this.state))
  // }
  submit = (values: object): void => {
    if (this.state.step > 2) {
      this.setState({ step: this.state.step + 1 })
    }
    console.log("submit", values);
  }

  render() {
    return (
      <div className="contianer">
        <Formik
          initialValues={step1}
          onSubmit={this.submit}
          // validationSchema={creationValidationSchema}
          validateOnBlur
          validateOnChange
        >
          {({ values, handleSubmit, handleBlur, handleChange, errors, touched, setFieldValue, setFieldTouched }) => <form onSubmit={handleSubmit}>
            <input type="text" name="customerName" data-qc="customerName" value={values.customerName} onChange={handleChange}></input>
            <input maxLength={14} className="form-control" placeholder="National Id Number" type="text" name="nationalId" value={values.nationalId}
              onChange={(e) => {
                const { name, value } = e.currentTarget;
                if (value.length === 14) {
                  setFieldValue('birthDate', getBirthdateFromNationalId(value));
                  setFieldValue('gender', getGenderFromNationalId(value));
                }
                setFieldValue(name, value);
              }}
              data-qc=""
              onBlur={handleBlur}></input>
            <input type="date" name="birthDate" data-qc="birthDate" value={values.birthDate} disabled></input>
            <select name="gender" data-qc="gender" value={values.gender} disabled>
              <option value="" disabled></option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <input type="date" name="nationalIdIssueDate" data-qc="nationalIdIssueDate" value={values.nationalIdIssueDate}></input>
            <input type="text" name="customerHomeAddress" data-qc="customerHomeAddress" value={values.customerHomeAddress}></input>
            <input type="text" name="homePostalCode" data-qc="homePostalCode" value={values.homePostalCode}></input>
            <input type="text" name="homePhoneNumber" data-qc="homePhoneNumber" value={values.homePhoneNumber}></input>
            <input type="text" name="mobilePhoneNumber" data-qc="mobilePhoneNumber" value={values.mobilePhoneNumber}></input>
            <input type="text" name="faxNumber" data-qc="faxNumber" value={values.faxNumber}></input>
            <input type="text" name="emailAddress" data-qc="emailAddress" value={values.emailAddress}></input>
            <input type="text" name="customerWebsite" data-qc="customerWebsite" value={values.customerWebsite}></input>
            <button type="submit">{this.state.step !== 3 ? 'Next' : 'Submit'}</button>
          </form>}
        </Formik>
      </div>
    )
  }
}

export default CustomerCreation;