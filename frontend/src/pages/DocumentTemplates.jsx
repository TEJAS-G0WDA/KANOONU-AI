import { useState, useEffect } from 'react';
import { FileText, Download, File, FileType, Edit3, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

// Load templates from localStorage or use default
const getInitialTemplates = () => {
  const saved = localStorage.getItem('documentTemplates');
  if (saved) {
    return JSON.parse(saved);
  }
  
  // Default templates with Indian legal standards
  return {
  contract: {
    name: 'Service Contract',
    category: 'Agreements',
    template: `SERVICE AGREEMENT

This Service Agreement ("Agreement") is entered into on this ${new Date().toLocaleDateString('en-IN')} between:

PARTY A (Service Provider):
Name: [Enter Name]
Address: [Enter Address]
Phone: [Enter Phone]
Email: [Enter Email]

AND

PARTY B (Client):
Name: [Enter Name]
Address: [Enter Address]
Phone: [Enter Phone]
Email: [Enter Email]

WHEREAS, Party A is engaged in the business of providing services and Party B desires to engage Party A for the provision of services;

NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, the parties agree as follows:

1. SCOPE OF SERVICES
Party A agrees to provide the following services to Party B:
[Describe services in detail]

2. TERM
This Agreement shall commence on [Start Date] and shall continue until [End Date], unless terminated earlier in accordance with the terms herein.

3. COMPENSATION
Party B agrees to pay Party A the sum of ₹[Amount] (Indian Rupees [Amount in words]) for the services rendered, payable as follows:
[Payment terms]

4. TERMINATION
Either party may terminate this Agreement with [Number] days' written notice to the other party.

5. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of India, and the courts of [City], India shall have exclusive jurisdiction.

6. ENTIRE AGREEMENT
This Agreement constitutes the entire agreement between the parties and supersedes all prior agreements, understandings, or representations.

IN WITNESS WHEREOF, the parties have executed this Agreement on the date first written above.

PARTY A (Service Provider)          PARTY B (Client)

_________________                    _________________
Signature                            Signature

Name:                                Name:
Date:                                Date:`
  },
  agreement: {
    name: 'Partnership Agreement',
    category: 'Agreements',
    template: `PARTNERSHIP AGREEMENT

This Partnership Agreement ("Agreement") is made and entered into on ${new Date().toLocaleDateString('en-IN')} by and between:

PARTNER 1:
Name: [Enter Name]
Address: [Enter Address]
PAN: [Enter PAN]
Aadhaar: [Enter Aadhaar]

PARTNER 2:
Name: [Enter Name]
Address: [Enter Address]
PAN: [Enter PAN]
Aadhaar: [Enter Aadhaar]

WHEREAS, the parties desire to form a partnership for the purpose of [Business Purpose];

NOW, THEREFORE, the parties agree as follows:

1. PARTNERSHIP NAME
The partnership shall be known as "[Partnership Name]".

2. BUSINESS PURPOSE
The partnership is formed for the purpose of [Describe business activities].

3. CAPITAL CONTRIBUTION
Partner 1 shall contribute ₹[Amount] and Partner 2 shall contribute ₹[Amount] to the partnership capital.

4. PROFIT AND LOSS SHARING
Profits and losses shall be shared equally between the partners, unless otherwise agreed.

5. MANAGEMENT
All partners shall have equal rights in the management of the partnership business.

6. DURATION
This partnership shall commence on [Start Date] and shall continue until dissolved by mutual agreement or as provided by law.

7. DISSOLUTION
The partnership may be dissolved by mutual consent of all partners or in accordance with the Indian Partnership Act, 1932.

8. GOVERNING LAW
This Agreement shall be governed by the Indian Partnership Act, 1932, and the laws of India.

IN WITNESS WHEREOF, the parties have executed this Agreement.

PARTNER 1                          PARTNER 2

_________________                   _________________
Signature                           Signature

Name:                               Name:
Date:                               Date:`
  },
  notice: {
    name: 'Legal Notice',
    category: 'Notices',
    template: `LEGAL NOTICE

Date: ${new Date().toLocaleDateString('en-IN')}

To,
[Name of Recipient]
[Address]

Subject: Legal Notice under Section 80 of the Code of Civil Procedure, 1908

Dear Sir/Madam,

I, [Your Name], residing at [Your Address], through my advocate [Advocate Name], hereby serve you with this legal notice under Section 80 of the Code of Civil Procedure, 1908.

FACTS:
1. [State relevant facts]
2. [State relevant facts]
3. [State relevant facts]

CLAIMS:
Based on the above facts, you are liable to pay me the following amounts:
1. Principal amount: ₹[Amount]
2. Interest: ₹[Amount]
3. Damages: ₹[Amount]
Total: ₹[Total Amount]

DEMAND:
I hereby demand that you:
1. Pay the sum of ₹[Total Amount] within [Number] days from the receipt of this notice;
2. Cease and desist from [Action to be stopped];
3. Comply with [Other requirements].

In the event you fail to comply with the above demands within the stipulated time, I shall be constrained to initiate appropriate legal proceedings against you in a court of competent jurisdiction, seeking all available remedies under law, including but not limited to:
- Recovery of the amounts due
- Interest and damages
- Costs of litigation
- Any other relief as the court may deem fit

This notice is being sent without prejudice to my rights and remedies available under law.

Yours faithfully,

[Your Name]
[Your Address]
[Your Phone]
[Your Email]

Through:
[Advocate Name]
[Advocate Address]
[Advocate Phone]
[Advocate Email]`
  },
  rental: {
    name: 'Rental Agreement',
    category: 'Property',
    template: `RENTAL AGREEMENT

This Rental Agreement ("Agreement") is made on ${new Date().toLocaleDateString('en-IN')} between:

LANDLORD:
Name: [Enter Name]
Address: [Enter Address]
Phone: [Enter Phone]
PAN: [Enter PAN]

AND

TENANT:
Name: [Enter Name]
Address: [Enter Address]
Phone: [Enter Phone]
Aadhaar: [Enter Aadhaar]

PROPERTY DETAILS:
Address: [Property Address]
Type: [Residential/Commercial]
Area: [Square Feet/Square Meters]

TERMS AND CONDITIONS:

1. RENT
The monthly rent for the premises is ₹[Amount] (Indian Rupees [Amount in words]), payable on or before the [Day] of each month.

2. SECURITY DEPOSIT
The tenant has paid a security deposit of ₹[Amount], which shall be refunded at the end of the tenancy period, subject to deductions for any damages.

3. TENURE
This Agreement shall be for a period of [Number] months, commencing from [Start Date] to [End Date].

4. USE OF PREMISES
The tenant shall use the premises solely for [Residential/Commercial] purposes and shall not use it for any illegal activities.

5. MAINTENANCE
The tenant shall maintain the premises in good condition and shall be responsible for any damages caused by negligence.

6. TERMINATION
Either party may terminate this Agreement by giving [Number] days' written notice to the other party.

7. GOVERNING LAW
This Agreement shall be governed by the laws of India and the Rent Control Act applicable in [State/City].

IN WITNESS WHEREOF, the parties have executed this Agreement.

LANDLORD                          TENANT

_________________                 _________________
Signature                         Signature

Name:                             Name:
Date:                             Date:

WITNESSES:

Witness 1:                        Witness 2:
Name:                             Name:
Signature:                        Signature:`
  },
  saleDeed: {
    name: 'Sale Deed',
    category: 'Property',
    template: `SALE DEED

This Sale Deed is executed on ${new Date().toLocaleDateString('en-IN')} at [Place]

BETWEEN:

SELLER:
Name: [Enter Name]
Father's/Husband's Name: [Enter Name]
Address: [Enter Address]
Aadhaar: [Enter Aadhaar]
PAN: [Enter PAN]
(Hereinafter called "SELLER")

AND

PURCHASER:
Name: [Enter Name]
Father's/Husband's Name: [Enter Name]
Address: [Enter Address]
Aadhaar: [Enter Aadhaar]
PAN: [Enter PAN]
(Hereinafter called "PURCHASER")

WHEREAS the Seller is the absolute owner of the property described below and has agreed to sell the same to the Purchaser for the consideration mentioned herein.

PROPERTY DESCRIPTION:
Plot No: [Enter Plot No]
Area: [Enter Area in Sq Ft/Sq Mtrs]
Situated at: [Enter Complete Address]
Survey No: [Enter Survey No]
Boundaries:
  North: [Enter Boundary]
  South: [Enter Boundary]
  East: [Enter Boundary]
  West: [Enter Boundary]

CONSIDERATION:
The total sale consideration for the above property is ₹[Amount] (Indian Rupees [Amount in Words]) which has been paid by the Purchaser to the Seller as follows:
- Amount paid on [Date]: ₹[Amount]
- Balance amount: ₹[Amount]

The Seller hereby acknowledges receipt of the full consideration and grants full receipt and discharge thereof.

COVENANTS:

1. The Seller hereby transfers and conveys unto the Purchaser all rights, title, and interest in the said property.

2. The Seller warrants that the property is free from all encumbrances, charges, liens, and claims.

3. The Seller has good and marketable title to the property and has full authority to sell the same.

4. All statutory dues, taxes, and charges up to the date of execution have been paid by the Seller.

5. The Purchaser shall be entitled to peaceful possession of the property from the date of registration.

IN WITNESS WHEREOF the parties have executed this Sale Deed.

SELLER                           PURCHASER

_________________                _________________
Signature                        Signature
Name:                            Name:
Date:                            Date:

WITNESSES:
1. Name:                         2. Name:
   Signature:                       Signature:
   Address:                         Address:`
  },
  powerOfAttorney: {
    name: 'Power of Attorney',
    category: 'Legal Documents',
    template: `GENERAL POWER OF ATTORNEY

This Power of Attorney is executed on ${new Date().toLocaleDateString('en-IN')} at [Place]

BY:

PRINCIPAL:
Name: [Enter Name]
Father's/Husband's Name: [Enter Father's/Husband's Name]
Address: [Enter Address]
Aadhaar: [Enter Aadhaar]
PAN: [Enter PAN]
(Hereinafter called "PRINCIPAL")

IN FAVOUR OF:

ATTORNEY:
Name: [Enter Name]
Father's/Husband's Name: [Enter Father's/Husband's Name]
Address: [Enter Address]
Aadhaar: [Enter Aadhaar]
PAN: [Enter PAN]
(Hereinafter called "ATTORNEY")

WHEREAS the Principal desires to appoint the Attorney to act on behalf of the Principal in all matters as specified below:

NOW THIS POWER OF ATTORNEY WITNESSETH as follows:

1. The Principal hereby nominates, constitutes and appoints the Attorney to be the true and lawful attorney for the Principal.

2. The Attorney shall have the power and authority to:
   a) Sign, execute and deliver all documents on behalf of the Principal
   b) Represent the Principal before any court, tribunal, or authority
   c) Operate bank accounts and conduct financial transactions
   d) Purchase, sell, mortgage, lease or otherwise deal with immovable property
   e) File income tax returns and represent before tax authorities
   f) Hire and terminate employees on behalf of the Principal
   g) [Add any specific powers]

3. The Attorney shall act in the best interest of the Principal at all times.

4. This Power of Attorney shall be valid for [Duration/Until Revoked].

5. The Principal reserves the right to revoke this Power of Attorney at any time by giving written notice.

6. All acts done by the Attorney pursuant to this Power of Attorney shall be binding on the Principal.

IN WITNESS WHEREOF the Principal has executed this Power of Attorney.

PRINCIPAL                        ATTORNEY
                                (Acceptance)

_________________                _________________
Signature                        Signature
Name:                            Name:
Date:                            Date:

WITNESSES:
1. Name:                         2. Name:
   Signature:                       Signature:
   Address:                         Address:

NOTARY PUBLIC:
Signature:
Name:
Seal:`
  },
  employmentContract: {
    name: 'Employment Contract',
    category: 'Agreements',
    template: `EMPLOYMENT CONTRACT

This Employment Agreement is made on ${new Date().toLocaleDateString('en-IN')}

BETWEEN:

EMPLOYER:
Company Name: [Enter Company Name]
Registered Office: [Enter Address]
CIN: [Enter CIN]
PAN: [Enter PAN]
(Hereinafter called "EMPLOYER")

AND

EMPLOYEE:
Name: [Enter Name]
Father's/Husband's Name: [Enter Name]
Address: [Enter Address]
Aadhaar: [Enter Aadhaar]
PAN: [Enter PAN]
(Hereinafter called "EMPLOYEE")

WHEREAS the Employer desires to employ the Employee and the Employee has agreed to work for the Employer on the terms and conditions set forth below:

1. POSITION AND DUTIES
The Employee is appointed as [Designation] and shall perform duties as assigned by the Employer from time to time.

2. COMMENCEMENT DATE
The employment shall commence on [Start Date].

3. SALARY AND BENEFITS
   a) Basic Salary: ₹[Amount] per month
   b) House Rent Allowance: ₹[Amount]
   c) Special Allowance: ₹[Amount]
   d) Total CTC: ₹[Amount] per annum
   e) Benefits: [Medical Insurance/Provident Fund/Gratuity]

4. WORKING HOURS
The Employee shall work [Number] hours per day, [Number] days per week.

5. LEAVE ENTITLEMENT
   a) Casual Leave: [Number] days per year
   b) Sick Leave: [Number] days per year
   c) Earned Leave: [Number] days per year

6. PROBATION PERIOD
The Employee shall be on probation for [Number] months from the date of joining.

7. TERMINATION
Either party may terminate this contract by giving [Number] days' written notice or salary in lieu thereof.

8. CONFIDENTIALITY
The Employee shall not disclose any confidential information of the Employer during or after employment.

9. NON-COMPETE
The Employee shall not engage in any competing business during employment and for [Number] months after termination.

10. GOVERNING LAW
This Agreement shall be governed by the laws of India.

IN WITNESS WHEREOF the parties have executed this Agreement.

EMPLOYER                         EMPLOYEE

_________________                _________________
Signature                        Signature
Name:                            Name:
Designation:                     Date:
Date:

Company Seal

WITNESSES:
1. Name:                         2. Name:
   Signature:                       Signature:`
  },
  will: {
    name: 'Last Will and Testament',
    category: 'Legal Documents',
    template: `LAST WILL AND TESTAMENT

I, [Enter Your Full Name], aged [Age] years, residing at [Enter Complete Address], being of sound mind and memory, do hereby make, publish and declare this to be my Last Will and Testament.

PERSONAL DETAILS:
Father's/Husband's Name: [Enter Name]
Date of Birth: [Enter DOB]
Aadhaar: [Enter Aadhaar]
PAN: [Enter PAN]

REVOCATION:
I hereby revoke all previous Wills and Codicils made by me.

EXECUTOR APPOINTMENT:
I appoint [Executor Name], [Relationship], residing at [Address] as the Executor of this Will. In case of inability or refusal, I appoint [Alternate Executor Name] as the alternate executor.

ASSETS AND PROPERTIES:
I am the owner of the following assets:

1. IMMOVABLE PROPERTIES:
   a) Property at [Address], Area: [Sq Ft], Value: ₹[Amount]
   b) [Add more properties]

2. MOVABLE PROPERTIES:
   a) Bank Accounts in [Bank Names]
   b) Fixed Deposits: ₹[Amount]
   c) Shares and Mutual Funds: ₹[Amount]
   d) Jewelry and valuables: [Description]
   e) Vehicles: [Details]

BEQUESTS:

1. I bequeath to my [Wife/Husband] [Name]:
   - [Property/Asset Description]
   - [Share/Percentage]

2. I bequeath to my son/daughter [Name]:
   - [Property/Asset Description]
   - [Share/Percentage]

3. I bequeath to [Other Beneficiary Name]:
   - [Property/Asset Description]
   - [Amount/Share]

RESIDUARY CLAUSE:
All remaining assets not specifically bequeathed shall be divided equally among [Names of Beneficiaries].

FUNERAL ARRANGEMENTS:
My funeral shall be conducted according to [Religious/Personal preferences].

GUARDIANSHIP (if applicable):
In case of minor children, I appoint [Guardian Name] as the guardian of my children [Children Names].

SPECIAL INSTRUCTIONS:
[Any specific instructions or conditions]

DECLARATION:
I declare that this is my Last Will and Testament and I have made it of my own free will without any coercion or undue influence.

TESTATOR:

_________________
Signature
Name:
Date:
Place:

WITNESSES:

1. Witness 1:                    2. Witness 2:
   Name:                            Name:
   Father's Name:                   Father's Name:
   Address:                         Address:
   Signature:                       Signature:
   Date:                            Date:

Note: This Will should be registered for legal validity under Section 18 of the Registration Act, 1908.`
  },
  nda: {
    name: 'Non-Disclosure Agreement',
    category: 'Agreements',
    template: `NON-DISCLOSURE AGREEMENT (NDA)

This Non-Disclosure Agreement ("Agreement") is made on ${new Date().toLocaleDateString('en-IN')}

BETWEEN:

DISCLOSING PARTY:
Name: [Enter Name/Company Name]
Address: [Enter Address]
[PAN/CIN]: [Enter PAN/CIN]
(Hereinafter called "DISCLOSING PARTY")

AND

RECEIVING PARTY:
Name: [Enter Name/Company Name]
Address: [Enter Address]
[PAN/CIN]: [Enter PAN/CIN]
(Hereinafter called "RECEIVING PARTY")

WHEREAS the Disclosing Party possesses certain confidential and proprietary information and the Receiving Party desires to receive such information for the purpose of [Purpose of Disclosure].

NOW THEREFORE, in consideration of the mutual covenants and agreements contained herein, the parties agree as follows:

1. DEFINITION OF CONFIDENTIAL INFORMATION
"Confidential Information" means all information disclosed by the Disclosing Party to the Receiving Party, including but not limited to:
   a) Business plans, strategies, and financial information
   b) Technical data, designs, and specifications
   c) Customer lists and supplier information
   d) Trade secrets and proprietary processes
   e) Software, source codes, and algorithms
   f) Marketing strategies and pricing information

2. OBLIGATIONS OF RECEIVING PARTY
The Receiving Party agrees to:
   a) Maintain confidentiality of all Confidential Information
   b) Use the information solely for [Specified Purpose]
   c) Not disclose to any third party without prior written consent
   d) Take reasonable measures to protect the information
   e) Limit access to employees on a need-to-know basis

3. EXCLUSIONS
This Agreement does not apply to information that:
   a) Is publicly available through no breach of this Agreement
   b) Was known to Receiving Party prior to disclosure
   c) Is independently developed by Receiving Party
   d) Is required to be disclosed by law or court order

4. TERM
This Agreement shall remain in effect for [Number] years from the date of execution.

5. RETURN OF MATERIALS
Upon termination or request, the Receiving Party shall return or destroy all Confidential Information and certify the same in writing.

6. REMEDIES
The parties acknowledge that breach of this Agreement may cause irreparable harm and the Disclosing Party shall be entitled to injunctive relief.

7. GOVERNING LAW
This Agreement shall be governed by the laws of India and courts of [City] shall have exclusive jurisdiction.

IN WITNESS WHEREOF the parties have executed this Agreement.

DISCLOSING PARTY                 RECEIVING PARTY

_________________                _________________
Signature                        Signature
Name:                            Name:
Date:                            Date:

WITNESSES:
1. Name:                         2. Name:
   Signature:                       Signature:`
  },
  leaveLicense: {
    name: 'Leave and License Agreement',
    category: 'Property',
    template: `LEAVE AND LICENSE AGREEMENT

This Agreement is made on ${new Date().toLocaleDateString('en-IN')} at [Place]

BETWEEN:

LICENSOR:
Name: [Enter Name]
Address: [Enter Address]
PAN: [Enter PAN]
Aadhaar: [Enter Aadhaar]
(Hereinafter called "LICENSOR")

AND

LICENSEE:
Name: [Enter Name]
Address: [Enter Address]
PAN: [Enter PAN]
Aadhaar: [Enter Aadhaar]
(Hereinafter called "LICENSEE")

WHEREAS the Licensor is the lawful owner of the premises described below and has agreed to grant a license to the Licensee to use and occupy the said premises.

PREMISES:
Address: [Complete Property Address]
Type: [Residential/Commercial]
Area: [Carpet Area in Sq Ft]
Flat/Unit No: [Enter Number]
Floor: [Enter Floor]

TERMS AND CONDITIONS:

1. LICENSE FEE
The monthly license fee is ₹[Amount] (Indian Rupees [Amount in Words]), payable on or before [Day] of each month via [Payment Mode].

2. DEPOSIT
The Licensee has paid an interest-free refundable deposit of ₹[Amount], which shall be refunded within [Number] days after vacating the premises, subject to deductions for damages.

3. LOCK-IN PERIOD
This Agreement has a lock-in period of [Number] months during which neither party can terminate without mutual consent.

4. TENURE
This License shall be for [Number] months commencing from [Start Date] and ending on [End Date].

5. PERMITTED USE
The premises shall be used only for [Residential/Commercial] purposes and not for any illegal activities.

6. MAINTENANCE CHARGES
[Included in license fee/Payable separately]: ₹[Amount] per month for society maintenance, water, and common area expenses.

7. UTILITIES
Electricity, water, and other utility charges shall be borne by the [Licensor/Licensee].

8. FURNISHINGS (if applicable)
The premises are being licensed with the following furnishings:
   [List of furniture and appliances]

9. REPAIRS AND MAINTENANCE
a) Minor repairs: Licensee's responsibility
b) Major structural repairs: Licensor's responsibility
c) The Licensee shall maintain the premises in good condition

10. NOTICE PERIOD
Either party may terminate by giving [Number] days' written notice after the lock-in period.

11. EARLY TERMINATION
If the Licensee vacates before the agreed period, [Number] months' license fee shall be forfeited.

12. REGISTRATION
This Agreement shall be registered under the Registration Act, 1908, and Maharashtra Rent Control Act, 1999 (if applicable).

13. INSPECTION
The Licensor may inspect the premises with prior notice of [Number] hours.

14. SUBLETTING
The Licensee shall not sublet or part with possession of the premises.

15. ALTERATIONS
No structural alterations shall be made without written permission of the Licensor.

16. GOVERNING LAW
This Agreement shall be governed by the laws of India and disputes shall be subject to the jurisdiction of courts at [City].

IN WITNESS WHEREOF the parties have executed this Agreement.

LICENSOR                         LICENSEE

_________________                _________________
Signature                        Signature
Name:                            Name:
Date:                            Date:

WITNESSES:

1. Witness 1:                    2. Witness 2:
   Name:                            Name:
   Address:                         Address:
   Signature:                       Signature:

ANNEXURE - INVENTORY OF FURNISHINGS
[Detailed list with condition noted]

This document should be printed on stamp paper of appropriate value as per state laws.`
  }
  };
};

const documentTemplates = getInitialTemplates();

function DocumentTemplates() {
  const { t } = useLanguage();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [documentContent, setDocumentContent] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Get categories from templates
  const categories = ['All', ...new Set(Object.values(documentTemplates).map(t => t.category || 'Agreements'))];

  // Filter templates by category
  const filteredTemplates = selectedCategory === 'All' 
    ? documentTemplates 
    : Object.fromEntries(
        Object.entries(documentTemplates).filter(([key, template]) => 
          (template.category || 'Agreements') === selectedCategory
        )
      );

  const handleTemplateSelect = (key) => {
    setSelectedTemplate(key);
    setDocumentContent(documentTemplates[key].template);
    setDocumentName(documentTemplates[key].name);
  };

  const exportToPDF = () => {
    // Simple PDF export using browser print
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${documentName}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
            pre { white-space: pre-wrap; font-family: Arial, sans-serif; }
          </style>
        </head>
        <body>
          <pre>${documentContent}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const exportToWord = () => {
    // Create a Word document using Blob
    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset='utf-8'>
          <title>${documentName}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
            pre { white-space: pre-wrap; font-family: Arial, sans-serif; }
          </style>
        </head>
        <body>
          <pre>${documentContent}</pre>
        </body>
      </html>
    `;
    
    const blob = new Blob(['\ufeff', content], {
      type: 'application/msword'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${documentName.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl font-bold text-gray-900 mb-4">
            Legal Document Template Generator
          </h1>
          <p className="text-lg text-gray-600">
            Generate professional legal documents with Indian legal standards
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Template Selection */}
          <div className="lg:col-span-1">
            <div className="card sticky top-4">
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-6 w-6 text-amber-600" />
                Select Template ({Object.keys(filteredTemplates).length})
              </h2>
              
              {/* Category Filter */}
              <div className="mb-4 flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {Object.entries(filteredTemplates).map(([key, template]) => (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTemplateSelect(key)}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      selectedTemplate === key
                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                        : 'bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FileType className="h-5 w-5" />
                      <span className="font-semibold">{template.name}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Document Editor */}
          <div className="lg:col-span-2">
            {selectedTemplate ? (
              <div className="card">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-heading text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Edit3 className="h-6 w-6 text-amber-600" />
                    {documentTemplates[selectedTemplate].name}
                  </h2>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={exportToPDF}
                      className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                    >
                      <File className="h-4 w-4" />
                      Export PDF
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={exportToWord}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                    >
                      <Download className="h-4 w-4" />
                      Export Word
                    </motion.button>
                  </div>
                </div>
                <textarea
                  value={documentContent}
                  onChange={(e) => setDocumentContent(e.target.value)}
                  className="w-full h-[600px] p-4 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gradient-to-br from-amber-50/50 to-orange-50/50 font-mono text-sm resize-none"
                  placeholder="Select a template to get started..."
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 Edit the template as needed. Replace placeholders in [brackets] with actual information.
                </p>
              </div>
            ) : (
              <div className="card text-center py-16">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  Select a template from the left to get started
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentTemplates;

