import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import SurveyField from './SurveyField';
import _ from 'lodash';
import validateEmails from '../../utils/validateEmails';
import { Link } from 'react-router-dom';
import FIELDS from './formFields';


class SurveyForm extends Component{
    renderField(){
        return _.map(FIELDS, ({label, name})=>{           
            return <Field key={name} label={label} type="text" name={name} component={SurveyField} />  
        });
    }

    render(){
        const { onSurveySubmit }= this.props;
        
        return(
            <div>
                <form onSubmit={onSurveySubmit}> 
                    {this.renderField()}
                    <Link to="/surveys" className="red btn-flat white-text">Cancel</Link>
                    <button style={{float: 'right'}} className="teal btn-flat white-text" type="submit">Next</button>
                </form>
            </div>
        );
    }
}

function validate(values){
    const errors={};

    _.each(FIELDS, ({ name })=>{
        if(!values[name]){
            errors[name]=`You must provide a value`;
        }
    });
    
    errors.recipients=validateEmails(values.recipients || '');
    return errors; 
}

export default reduxForm({
    validate,
    form: 'surveyForm',
    destroyOnUnmount: false
})(SurveyForm);
