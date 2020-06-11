var input = document.getElementById("name").focus();
const job = document.getElementById("title");
const other = document.getElementById("other-title");
other.style.display = 'none';

job.addEventListener('change', event => {
  const value = event.target.value;
  if (value === 'other') {
    other.style.display = '';
  } else {
    other.style.display = 'none';
  }
})
    
// Color
const design = document.getElementById("design");
const colorFieldset = document.getElementById("colors-js-puns");
const color = document.getElementById("color");
colorFieldset.style.display = 'none'; 
design.addEventListener('change', event => {
  const value = event.target.value;
  if (value === 'Select Theme') {
    colorFieldset.style.display = 'none';
  } else if (value !== 'Select Theme') {
    colorFieldset.style.display = '';
  }

  const colorOptions = Object.values(color);
  const punsColors = ['cornflowerblue', 'darkslategrey', 'gold'];
  const heartColors = ['tomato', 'steelblue', 'dimgrey'];

  // using forEach instead of filter
  if (value === 'js puns') {
    colorOptions.forEach(option => {
      if (punsColors.includes(option.value) ) {
        option.selected = option.value === 'cornflowerblue'; 
        option.hidden = false;
      } else {
        option.hidden = true;
      }
    });
  } else if (value === 'heart js') {
    colorOptions.forEach(option => {
      if (heartColors.includes(option.value)) {
        option.selected = option.value === 'tomato'; 
        option.hidden = false;
      } else {
        option.hidden = true;
      }
    });
  }
})


// Activities time matcher aux functions
const activities = document.querySelector('.activities');
const activitiesTitle = document.querySelector('.activities legend');
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const cost = document.createElement('div');
activities.appendChild(cost);

let runningCost = 0;
cost.innerHTML = `
  <p>Total: $${runningCost}.00</p>`;

const dateStartEnd = (dayTime) => {
  var weekDay = dayTime.split(' ')[0];
  var startTime = dayTime.split(' ')[1].split('-')[0];
  var stisan = startTime.substring(startTime.length-2,startTime.length);
  startTime = stisan==='am' ? parseInt(startTime) : (parseInt(startTime)==12 ? parseInt(startTime) : parseInt(startTime)+12) ;
  var endTime = dayTime.split(' ')[1].split('-')[1];
  var etisan = endTime.substring(endTime.length-2,endTime.length);
  endTime = etisan==='am' ? parseInt(endTime) : (parseInt(endTime)==12 ? parseInt(endTime) : parseInt(endTime)+12) ;
  
  var dayWeekNumber = weekDay==='Tuesday' ? 1 : 2;
  var startDate = new Date(`0${6+dayWeekNumber}/08/2020 ${startTime}:00:00`);
  var endDate = new Date(`0${6+dayWeekNumber}/08/2020 ${endTime}:00:00`);
  return [startDate, endDate]
}

const dayMatcher = (d1,d2) => {
    var f1, f2;
    if(d1[0]<d2[0]){
        f1=d1; f2=d2;
    } else { f1=d2; f2=d1;}
    var result = (f1[1]<f2[0]) ? false : true;
    return result;
}

// Activities
activities.addEventListener('change', e => {
  const input = e.target;
  const inputChecked = input.checked;
  const activityCost = parseInt(input.getAttribute('data-cost'));

  runningCost+= inputChecked ? +activityCost: -activityCost;
  cost.innerHTML = `
    <p>Total: $${runningCost}.00</p>
  `;
  const activityDate = input.getAttribute('data-day-and-time');
  var dates;
  if(activityDate){
    dates = dateStartEnd(activityDate);
  }

  for (let i = 0; i < checkboxes.length; i += 1) {
    const currentInput = checkboxes[i];
    const currentDate = currentInput.getAttribute('data-day-and-time');
    if(currentDate && activityDate){
        var current = dateStartEnd(currentDate);
        const dateMatcher = dayMatcher(current,dates) && currentInput !== input;
        if (inputChecked && dateMatcher) {
        // not possible, date intersection
          currentInput.disabled = true;
        } else if (!inputChecked && dateMatcher) {
        // possible, no intersection
          currentInput.disabled = false;
        }
    }

  }
})


// PAyments
const payment = document.querySelector('#payment');
const paymentOptions = Object.values(payment);
const paymentCreditCard = document.querySelector('#credit-card');
const paymentPayPal = document.querySelector('#paypal');
const paymentBitcoin = document.querySelector('#bitcoin');
paymentOptions[0].hidden = true
payment.value = 'credit card';

const paymentDisplay = (pt) => {
    paymentCreditCard.style.display = 'none';
    paymentPayPal.style.display = 'none';
    paymentBitcoin.style.display = 'none';
    pt.style.display = '';
}

paymentDisplay(paymentCreditCard);

payment.addEventListener('change', e => {
  const value = e.target.value;

  if (value === 'credit card') {
    paymentDisplay(paymentCreditCard);
  } else if (value === 'paypal') {
    paymentDisplay(paymentPayPal);
  } else if (value === 'bitcoin') {
    paymentDisplay(paymentBitcoin);
  }
})


// Validation aux functions
const validateUnit = (field, errorField, msg, block, className) => {
  field.className = className;
  errorField.style.display = block;
  errorField.textContent = msg;
}

const createErrorElement = (noerror, className) => {
  var error = document.createElement('div');
  error.className = className;
  noerror.parentNode.insertBefore(error, noerror);
  error = document.querySelector(`.${className}`);
  return error
}

// validate name
const validateName = () => {
  const name = document.querySelector('#name');
  var nameError = createErrorElement(name, 'name-error');
  if (name.value === '') {
    validateUnit(name, nameError, 'Required field.', 'block', 'field-error');

  } else {
    validateUnit(name, nameError, '', 'none', '');
  }
}

// validate email
const validateEmail = () => {
  const email = document.querySelector('#mail');
  var emailError = createErrorElement(email, 'email-error');

  if (!/^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\.([a-zA-Z]{2,5})$/.test(email.value)) {
    validateUnit(email, emailError, 'Invalid Email.', 'block', 'field-error');
  } else {
    validateUnit(email, emailError, '', 'none', '');
  }
}

// Validate activities
const validateActivities = () => {
  const checkboxChecker = Array.prototype.slice.call(checkboxes).some(checkbox => checkbox.checked);
  
  [].forEach.call(document.querySelectorAll('.activities-error'),function(e){
    e.parentNode.removeChild(e);
  });

  var activitiesError = document.createElement('div');
  activitiesError.className = 'activities-error';
  activities.insertBefore(activitiesError, activitiesTitle.nextSibling);
  if (!checkboxChecker) {
    activitiesError.style.display = 'block';
    activitiesError.textContent = 'You must pick at least one activity.';
  } else {activitiesError.style.display = 'none';}
}

// Validate CC
const validateCC = () => {
  const ccNum = document.querySelector('#cc-num');
  var ccNumError = createErrorElement(ccNum, 'cc-num-error');

  const ccZIP = document.querySelector('#zip');
  var ccZIPError = createErrorElement(ccZIP, 'cc-zip-error');

  const ccCVV = document.querySelector('#cvv');
  var ccCVVError = createErrorElement(ccCVV, 'cc-cvv-error');

  // CC Validation
  if (payment.value === 'credit card') {

    // CC-Num Validation
    if (!ccNum.value) {
      validateUnit(ccNum, ccNumError, 'You must provide a credit card number.', 'block', 'field-error');
    } else if (!/^[0-9]{13,16}$/.test(ccNum.value)) {
      validateUnit(ccNum, ccNumError, 'Wrong credit card number, must be 13-16 digits.', 'block', 'field-error');
    } else {validateUnit(ccNum, ccNumError, '', 'none', '');};

    // ZIP Validation
    if (!/^[0-9]{5}$/.test(ccZIP.value)) {
      validateUnit(ccZIP, ccZIPError, 'Zip must be 5 digits.', 'block', 'field-error');
    } else {validateUnit(ccZIP, ccZIPError, '', 'none', '');};

    // CVV Validation
    if (!/^[0-9]{3}$/.test(ccCVV.value)) {
      validateUnit(ccCVV, ccCVVError, 'CVV must be 3 digits.', 'block', 'field-error');
    } else {validateUnit(ccCVV, ccCVVError, '', 'none', '');};
  }
}

// CC keup validation
const numCC = document.querySelector('#cc-num');
numCC.addEventListener('keyup', e => {
  validateCC();
})

// Validations when submited
const form = document.querySelector('form');
form.addEventListener('submit', e => {
  e.preventDefault();
  validateName();
  validateEmail();
  validateActivities();
  validateCC();
});