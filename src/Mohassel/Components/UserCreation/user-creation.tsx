import React from 'react'
import {UserDataForm} from './userDataFrom';
import { Formik } from 'formik';
interface Props{
    edit: boolean;
}
function UserCreation(props: Props) {
    return (
        <div>
            {props.edit ? 'Edit User' : 'Create User' }
            <Formik
            enableReinitialize
            initialValues = {{
                 values:{fullName: ''},
            }
                 
                
            }
            onSubmit={()=>{
                console.log('kik');
            }}
            >
                {(formikProps) =>
                <UserDataForm {...formikProps} />
}
            </Formik>

        </div>
    )
}

export default UserCreation
