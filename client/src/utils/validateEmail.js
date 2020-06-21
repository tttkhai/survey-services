const regex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const validateEmails = (emails)=>{
  const invalidEmails = emails
    .split(',')
    .map(email=> email.trim())
    .filter(email=> regex.test(email) === false)

  if(invalidEmails.length){
    return `${invalidEmails} invalid`;
  }
}

export default validateEmails;
