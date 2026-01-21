'use client'

import { useState } from 'react'
import { generateOfferLetterPDF } from '@/lib/pdfGenerator'
import { INDIAN_CITIES } from '@/lib/indianCities'

interface FormData {
  firstName: string
  middleName: string
  lastName: string
  phoneNumber: string
  emailId: string
  pf: string // Yes/No dropdown
  locationState: string // State for LWF/PT/ESIC calculations
  locationCity: string // City location
  doj: string
  nth: string // Net Salary (Take Home)
  ta: string
  designation: string
  offerId: string
  offerSend: string
  doo: string
  clientName: string
}

// States + Union Territories (used as "State" input for PT/LWF/ESIC mappings)
const INDIAN_STATES = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Jammu and Kashmir',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
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
    locationState: '',
    locationCity: '',
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

  const handleCityBlur = () => {
    const raw = (formData.locationCity || '').trim()
    if (!raw) return

    const match = INDIAN_CITIES.find((c) => c.toLowerCase() === raw.toLowerCase())
    if (!match) {
      setErrors((prev) => ({
        ...prev,
        locationCity: 'Please select a city from the dropdown.',
      }))
      return
    }

    // Normalize casing to the canonical city spelling from our list
    if (match !== raw) {
      setFormData((prev) => ({ ...prev, locationCity: match }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    // Phone and email are hidden, so not required
    if (!formData.locationState.trim()) newErrors.locationState = 'Location (State for LWF) is required'
    if (!formData.locationCity.trim()) newErrors.locationCity = 'Location (City) is required'
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

    setIsGenerating(true)
    try {
      // Calculate salary breakdown
      const salaryRes = await fetch('/api/calculate-salary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          netSalary: parseFloat(formData.nth),
          state: formData.locationState, // locationState contains the state for LWF/PT/ESIC
          pfEnabled: formData.pf === 'Yes',
          travelAllowance: formData.ta ? parseFloat(formData.ta) : undefined,
          doj: formData.doj, // Pass DOJ to extract month for LWF/Professional Tax calculations
        }),
      })

      const salaryBreakdownResponse = await salaryRes.json()
      if (!salaryRes.ok) {
        alert(salaryBreakdownResponse?.error || 'Failed to calculate salary breakdown.')
        return
      }

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

        <div className="form-group">
          <label htmlFor="locationState">Location (State for LWF) *</label>
          <select
            id="locationState"
            name="locationState"
            value={formData.locationState}
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
          {errors.locationState && <span className="error">{errors.locationState}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="locationCity">Location (City) *</label>
          <input
            type="text"
            id="locationCity"
            name="locationCity"
            value={formData.locationCity}
            onChange={handleChange}
            onBlur={handleCityBlur}
            required
            placeholder="Type to search and pick a city..."
            autoComplete="off"
            list="indian-cities"
          />
          <datalist id="indian-cities">
            {INDIAN_CITIES.map((city) => (
              <option key={city} value={city} />
            ))}
          </datalist>
          {errors.locationCity && <span className="error">{errors.locationCity}</span>}
        </div>
      </div>

      <div className="form-row">
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
            <small style={{ color: '#666', display: 'block', marginTop: '4px' }}>
             Note: Professional Tax can be month-specific (e.g., special rates in some states). LWF is deducted monthly.
            </small>
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
