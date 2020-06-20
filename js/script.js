

/*
Validation form:
Adds validation for intersecting dates, considering they might not match exacly,
but intersect partially.
Real time CC fields validation.
credit to 
https://github.com/awfy/interactiveform.git
https://github.com/shirux/interactiveForm.git
*/

document.getElementById("name").focus();
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
  const puns = ['cornflowerblue', 'darkslategrey', 'gold'];
  const heart = ['tomato', 'steelblue', 'dimgrey'];

  // using forEach instead of filter
  if (value === 'js puns') {
    colorOptions.forEach(option => {
      if (puns.includes(option.value) ) {
        option.selected = option.value === 'cornflowerblue'; 
        option.hidden = false;
      } else {
        option.hidden = true;
      }
    });
  } else if (value === 'heart js') {
    colorOptions.forEach(option => {
      if (heart.includes(option.value)) {
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

  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const inputChecked = input.checked;
  const activityCost = parseInt(e.target.getAttribute('data-cost'));
  document.querySelector('.activities').classList.remove("field_set");
  var activitiesError = document.querySelector('.activities-error');

  activitiesError.style.display = 'none';
  
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
const creditcard = document.querySelector('#credit-card');
const paypal = document.querySelector('#paypal');
const bitcoin = document.querySelector('#bitcoin');
paymentOptions[0].hidden = true
payment.value = 'credit card';

const paymentDisplay = (pt) => {
    creditcard.style.display = 'none';
    paypal.style.display = 'none';
    bitcoin.style.display = 'none';
    pt.style.display = '';
}

paymentDisplay(creditcard);

payment.addEventListener('change', e => {
  const value = e.target.value;

  if (value === 'credit card') {
    paymentDisplay(creditcard);
  } else if (value === 'paypal') {
    paymentDisplay(paypal);
  } else if (value === 'bitcoin') {
    paymentDisplay(bitcoin);
  }
})


// Validation aux functions
const validateUnit = (field, errorField, msg, block, className) => {
  field.className = className;
  errorField.style.display = block;
  errorField.style.color = "red";
  errorField.textContent = msg;
}

// validate name
const validateName = () => {
  const name = document.querySelector('#name');
  var nameError = document.querySelector('.name-error');
  if (name.value === '') {
    validateUnit(name, nameError, 'Required field.', 'block', 'field-error');
  } else {
    validateUnit(name, nameError, '', 'none', '');
  }
}

// validate email
const validateEmail = () => {
  const email = document.querySelector('#mail');
  var emailError = document.querySelector('.email-error');

  if (!/^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\.([a-zA-Z]{2,5})$/.test(email.value)) {
    validateUnit(email, emailError, 'Invalid Email.', 'block', 'field-error');
  } else {
    validateUnit(email, emailError, '', 'none', '');
  }
}

// Validate activities
const validateActivities = () => {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const checkboxChecker = Array.prototype.slice.call(checkboxes).some(checkbox => checkbox.checked);

  var activitiesError = document.querySelector('.activities-error');
  if (!checkboxChecker) {
    activitiesError.style.display = 'block';
    document.querySelector('.activities').classList.add("field_set");
    activitiesError.textContent = 'You must pick at least one activity.';
    activitiesError.style.color = "red";
  } else {activitiesError.style.display = 'none';}
}

// Validate CC
const validateCC = () => {
  const num = document.querySelector('#cc-num');
  var numError = document.querySelector('.cc-num-error');

  const zip = document.querySelector('#zip');
  var zipError = document.querySelector('.cc-zip-error');

  const cvv = document.querySelector('#cvv');
  var cvvError = document.querySelector('.cc-cvv-error');
  var validPayment = true;
  if (payment.value === 'credit card') {
    // CC-Num Validation
    if (!num.value) {
      validateUnit(num, numError, 'You must provide a credit card number.', 'block', 'field-error');
      validPayment = false;
    } else if (!/^[0-9]{13,16}$/.test(num.value)) {
      validateUnit(num, numError, 'Wrong credit card number, must be 13-16 digits.', 'block', 'field-error');
      validPayment = false;
    } else {validateUnit(num, numError, '', 'none', '');};

    // ZIP Validation
    if (!/^[0-9]{5}$/.test(zip.value)) {
      validateUnit(zip, zipError, 'Zip must be 5 digits.', 'block', 'field-error');
      validPayment = false;
    } else {validateUnit(zip, zipError, '', 'none', '');};

    // CVV Validation
    if (!/^[0-9]{3}$/.test(cvv.value)) {
      validateUnit(cvv, cvvError, 'CVV must be 3 digits.', 'block', 'field-error');
      validPayment = false;
    } else {validateUnit(cvv, cvvError, '', 'none', '');};
  }
  return validPayment;
}

// RealTime validation
const num = document.querySelector('#cc-num');
num.addEventListener('keyup', e => {
  validateCC();
})
const zip = document.querySelector('#zip');
zip.addEventListener('keyup', e => {
  validateCC();
})
const cvv = document.querySelector('#cvv');
cvv.addEventListener('keyup', e => {
  validateCC();
})
const name = document.querySelector('#name');
name.addEventListener('keyup', e => {
  validateName();
})
const email = document.querySelector('#mail');
email.addEventListener('keyup', e => {
  validateEmail();
})

// Validations when submited
const form = document.querySelector('form');
form.addEventListener('submit', e => {
  var vn = validateName();
  var ve = validateEmail();
  var va =validateActivities();
  var vc = validateCC();
  if (!(vn && ve && va && vc)) {
    e.preventDefault();
}
});