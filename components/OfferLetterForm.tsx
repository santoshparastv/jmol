'use client'

import { useState } from 'react'
import { generateOfferLetterPDF } from '@/lib/pdfGenerator'

interface FormData {
  firstName: string
  middleName: string
  lastName: string
  phoneNumber: string
  emailId: string
  pf: string // Yes/No dropdown
  location: string
  doj: string
  nth: string // Net Salary (Take Home)
  ta: string
  designation: string
  offerId: string
  offerSend: string
  doo: string
  clientName: string
}

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Puducherry',
]

export default function OfferLetterForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    middleName: '',
    lastName: '',
    phoneNumber: '',
    emailId: '',
    pf: 'Yes', // Default to Yes
    location: '',
    doj: '',
    nth: '',
    ta: '',
    designation: '',
    offerId: '',
    offerSend: '',
    doo: '',
    clientName: 'CREDHAS TECHNOLOGY PRIVATE LIMITED',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [isGenerating, setIsGenerating] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.emailId.trim()) newErrors.emailId = 'Email is required'
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required'
    if (!formData.location.trim()) newErrors.location = 'Location (State) is required'
    if (!formData.doj.trim()) newErrors.doj = 'Date of joining is required'
    if (!formData.designation.trim()) newErrors.designation = 'Designation is required'
    if (!formData.nth.trim()) newErrors.nth = 'Net salary (NTH) is required'
    if (!formData.offerId.trim()) newErrors.offerId = 'Offer ID is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) {
      return
    }

    // Validate PF: If PF is "No", check if basic <= 15000
    if (formData.pf === 'No') {
      try {
        const checkResponse = await fetch('/api/calculate-salary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            netSalary: parseFloat(formData.nth),
            state: formData.location,
            pfEnabled: false,
          }),
        })
        const checkData = await checkResponse.json()
        
        if (checkData.basic <= 15000) {
          alert('PF is mandatory for Basic Salary ≤ ₹15,000. Please select "Yes" for PF.')
          setIsGenerating(false)
          return
        }
      } catch (error) {
        console.error('Error checking PF requirement:', error)
      }
    }

    setIsGenerating(true)
    try {
      // Calculate salary breakdown
      const salaryBreakdownResponse = await fetch('/api/calculate-salary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          netSalary: parseFloat(formData.nth),
          state: formData.location, // location contains the state
          pfEnabled: formData.pf === 'Yes',
          travelAllowance: formData.ta ? parseFloat(formData.ta) : undefined,
        }),
      }).then(res => res.json())

      // Add travel allowance if provided
      const salaryBreakdown = {
        ...salaryBreakdownResponse,
        travelAllowance: formData.ta && formData.ta.trim() !== '' 
          ? parseFloat(formData.ta) 
          : undefined,
      }

      // Generate PDF
      await generateOfferLetterPDF({
        ...formData,
        salaryBreakdown,
        clientName: formData.clientName || 'CREDHAS TECHNOLOGY PRIVATE LIMITED',
      })
    } catch (error) {
      console.error('Error generating offer letter:', error)
      alert('Error generating offer letter. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2 style={{ marginBottom: '1.5rem' }}>Employee Details</h2>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName">First Name *</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          {errors.firstName && <span className="error">{errors.firstName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="middleName">Middle Name</label>
          <input
            type="text"
            id="middleName"
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name *</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          {errors.lastName && <span className="error">{errors.lastName}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number *</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="emailId">Email ID *</label>
          <input
            type="email"
            id="emailId"
            name="emailId"
            value={formData.emailId}
            onChange={handleChange}
            required
          />
          {errors.emailId && <span className="error">{errors.emailId}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="designation">Designation *</label>
          <input
            type="text"
            id="designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            required
          />
          {errors.designation && <span className="error">{errors.designation}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="location">Location (State) *</label>
          <select
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          >
            <option value="">Select State</option>
            {INDIAN_STATES.map(state => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {errors.location && <span className="error">{errors.location}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="doj">Date of Joining (DOJ) *</label>
          <input
            type="date"
            id="doj"
            name="doj"
            value={formData.doj}
            onChange={handleChange}
            required
          />
          {errors.doj && <span className="error">{errors.doj}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="doo">Date of Offer (DOO)</label>
          <input
            type="date"
            id="doo"
            name="doo"
            value={formData.doo}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="offerId">Offer ID *</label>
          <input
            type="text"
            id="offerId"
            name="offerId"
            value={formData.offerId}
            onChange={handleChange}
            required
          />
          {errors.offerId && <span className="error">{errors.offerId}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="offerSend">Offer Send Date</label>
          <input
            type="date"
            id="offerSend"
            name="offerSend"
            value={formData.offerSend}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="nth">NTH (Net Salary) (₹) *</label>
          <input
            type="number"
            id="nth"
            name="nth"
            value={formData.nth}
            onChange={handleChange}
            required
            min="0"
            step="1"
            placeholder="e.g., 12975"
          />
          {errors.nth && <span className="error">{errors.nth}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="pf">PF *</label>
          <select
            id="pf"
            name="pf"
            value={formData.pf}
            onChange={handleChange}
            required
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          {formData.pf === 'No' && (
            <small style={{ color: '#666', display: 'block', marginTop: '4px' }}>
              Note: PF is mandatory if Basic Salary ≤ ₹15,000
            </small>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="ta">TA</label>
          <input
            type="text"
            id="ta"
            name="ta"
            value={formData.ta}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="clientName">Client Name</label>
          <input
            type="text"
            id="clientName"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            placeholder="e.g., CREDHAS TECHNOLOGY PRIVATE LIMITED"
          />
        </div>
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button type="submit" className="btn" disabled={isGenerating}>
          {isGenerating ? 'Generating...' : 'Generate Offer Letter PDF'}
        </button>
      </div>
    </form>
  )
}
