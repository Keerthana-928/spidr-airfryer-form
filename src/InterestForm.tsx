import { useState } from 'react';
import './App.css';

type FormField = 'firstName' | 'lastName' | 'countryCode' | 'phone' | 'email' | 'cost' | 'pin';
type FormData = {
  [key in FormField]: string;
};
type ErrorData = {
  [key in Exclude<FormField, 'countryCode'>]?: string;
};

export default function AirFryerForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    countryCode: '+1',
    phone: '',
    email: '',
    cost: '',
    pin: '',
  });

  const [errors, setErrors] = useState<ErrorData>({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors: ErrorData = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pinDigitsOnly = formData.pin.replace(/\D/g, '');

    if (!formData.firstName.trim()) newErrors.firstName = '! Enter your first name';
    if (!formData.lastName.trim()) newErrors.lastName = '! Enter your last name';

    if (!emailRegex.test(formData.email)) newErrors.email = '! Enter a valid email';
    if (!formData.cost.trim()) newErrors.cost = '! Enter your cost guess';

    if (!formData.phone.trim()) {
      newErrors.phone = '! Enter your phone number';
    } else if (formData.phone.length !== 10) {
      newErrors.phone = '! Phone must be 10 digits';
    }

    if (!pinDigitsOnly) {
      newErrors.pin = '! Enter your 16-digit PIN';
    } else if (pinDigitsOnly.length !== 16) {
      newErrors.pin = '! PIN must be 16 digits';
    }

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newValue = value;
    let message = '';

    if (name === 'firstName' || name === 'lastName') {
      newValue = value.replace(/[^a-zA-Z]/g, '');
      if (value !== newValue) message = '! Alphabets only';
    }

    if (name === 'phone' || name === 'cost') {
      newValue = value.replace(/[^0-9]/g, '');
      if (value !== newValue) message = '! Numbers only';
    }

    if (name === 'pin') {
      const onlyDigits = value.replace(/\D/g, '');
      const groups = onlyDigits.slice(0, 16).match(/.{1,4}/g);
      newValue = groups ? groups.join('-') : '';

      if (!/^[0-9-]*$/.test(value)) {
        message = '! Only numbers allowed';
      } else if (onlyDigits.length > 16) {
        message = '! Max 16 digits allowed';
      }
    }

    setFormData(prev => ({ ...prev, [name]: newValue }));
    setErrors(prev => ({ ...prev, [name]: message }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(prev => ({ ...prev, ...validationErrors }));

    if (Object.keys(validationErrors).length === 0) {
      console.log("Submitted form data:", formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const labelMap: Record<FormField, string> = {
    firstName: 'First Name:',
    lastName: 'Last Name:',
    countryCode: 'Country Code',
    phone: 'Phone:',
    email: 'Email:',
    cost: 'Guess the Air Fryer’s Cost ($):',
    pin: '16-digit Spidr PIN:',
  };

  return (
    <div className="page-layout">
      <img src="/spidr-airfryer-form/logo.png" alt="Spidr Logo" className="hanging-logo" />

      <img src="/spidr-airfryer-form/airfryer.png" className="side-image" alt="Air Fryer" />
      <div className="form-wrapper">
        <h1 className="heading">Spidr Air Fryer Interest Form</h1>
        <form onSubmit={handleSubmit} className="form">
          {(['firstName', 'lastName', 'phone', 'email', 'cost', 'pin'] as FormField[]).map((field, index) => (
            <div key={index} className="form-group">
              <label className="form-label">{labelMap[field]}</label>
              <div className="input-row">
                {field === 'phone' && (
                  <select
                    value={formData.countryCode}
                    onChange={e => setFormData({ ...formData, countryCode: e.target.value })}
                    className="country-code-select"
                  >
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+44">🇬🇧 +44</option>
                  </select>
                )}
                <input
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="form-input"
                />
                {(field !== 'countryCode') && (
                  <div style={{ minWidth: '160px', marginLeft: '8px' }}>
                    {errors[field as keyof ErrorData] && (
                      <span style={{ color: 'white', fontSize: '12px' }}>
                        {errors[field as keyof ErrorData]}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          <button type="submit" className="submit-btn">Submit</button>
          {success && <div className="success-message">🎉 Form submitted successfully!</div>}
        </form>
      </div>
    </div>
  );
}
