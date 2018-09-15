import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import FIELDS from './form';
import _ from 'lodash';
import * as actions from '../../actions';
// import SurveyForm from './SurveyForm';

const SurveyFormReview = ({ onCancel, formValues, submitSurvey, history }) => {
  const review = _.map(FIELDS, fields =>{
    return (
      <div>
        <label>{fields.label}</label>
        <div style={{marginBottom: '10px'}}>
          {formValues[fields.name]}
        </div>
      </div>
    );
  });

  return (
    <div>
      <h5> Please confirm your Survey</h5>
      {review}
      <button
        className="yellow darken-3 btn-flat" onClick={onCancel}>Back
      </button>
      <button
        onClick={() => submitSurvey(formValues, history)}
        className="green darken-3 btn-flat white-text right">Send Survey
        <i className="material-icons right">email</i>
      </button>
    </div>
  );
};

function mapStateToProps({form}){
  return {formValues: form.surveyForm.values};
}

export default connect(mapStateToProps, actions) (withRouter(SurveyFormReview));
