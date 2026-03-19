var e=`meta:
  title: "Canada CRS"
  desc: "The Comprehensive Ranking System (CRS) is a points-based system that the IRCC uses to assess and score your profile and rank it in the Express Entry pool."
form:
  english:
    label: "English Proficiency"
    desc: "Do you possess one of the following English proficiency test scores within the last 2 years?"
    values:
      "no": "No"
      "CELPIP-G": "CELPIP-G"
      "IELTS": "IELTS"
      "PTE Core": "PTE Core"
  french:
    label: "French Proficiency"
    desc: "Do you possess one of the following French proficiency test scores within the last 2 years?"
    values:
      "no": "No"
      "TEF Canada": "TEF Canada"
      "TCF Canada": "TCF Canada"
  english_celpip_speaking_score:
    label: "CELPIP-G Speaking"
  english_celpip_writing_score:
    label: "CELPIP-G Writing"
  english_celpip_reading_score:
    label: "CELPIP-G Reading"
  english_celpip_listening_score:
    label: "CELPIP-G Listening"
  english_ielts_speaking_score:
    label: "IELTS Speaking"
  english_ielts_writing_score:
    label: "IELTS Writing"
  english_ielts_reading_score:
    label: "IELTS Reading"
  english_ielts_listening_score:
    label: "IELTS Listening"
  english_ple_speaking_score:
    label: "PTE Core Speaking"
  english_ple_writing_score:
    label: "PTE Core Writing"
  english_ple_reading_score:
    label: "PTE Core Reading"
  english_ple_listening_score:
    label: "PTE Core Listening"
  french_tef_speaking_score:
    label: "TEF Canada Speaking"
  french_tef_writing_score:
    label: "TEF Canada Writing"
  french_tef_reading_score:
    label: "TEF Canada Reading"
  french_tef_listening_score:
    label: "TEF Canada Listening"
  french_tcf_speaking_score:
    label: "TCF Canada Speaking"
  french_tcf_writing_score:
    label: "TCF Canada Writing"
  french_tcf_reading_score:
    label: "TCF Canada Reading"
  french_tcf_listening_score:
    label: "TCF Canada Listening"    
  age:
    label: "Age"
    desc: "How old are you?"
    values:
  with_spouse:
    label: "Spouse"
    desc: "Do you have a spouse or common-law partner that comes with you to Canada, and is not a Canadian citizen or permanent resident?"
    values:
      "yes": "Yes"
      "no": "No"
  education:
    label: "Education"
    desc: "What is your highest level of education?"
    values:
      "less_than_high_school": "Less than high school"
      "secondary" : "Secondary Diploma"
      "one_year_college_degree": "One-year Program at a university"
      "two_year_college_program": "Two-year Program at a university"
      "bachelor_or_three_year_program" : "Bachelor's Degree"
      "multiple_degrees": "Multiple Bachelor's Degrees"
      "master_or_professional_degree": "Master's or Professional Degree"
      "doctor": "Doctoral Degree (PhD)"
  spouse_education:
    label: "Spouse's Education"
    desc: "What is the highest level of education your spouse or common-law partner has?"
  spouse_language_proficiency:
    label: "Spouse's Language Proficiency"
    desc: "Do your spouse possess one of the following official language proficiency test scores within the last 2 years?"
    values:
      "no": "No"
      "CELPIP-G": "CELPIP-G"
      "IELTS": "IELTS"
      "PTE Core": "PTE Core"
      "TEF Canada": "TEF Canada"
      "TCF Canada": "TCF Canada"
  spouse_english_celpip_speaking_score:
    label: "Spouse's CELPIP-G Speaking"
  spouse_english_celpip_writing_score:
    label: "Spouse's CELPIP-G Writing"
  spouse_english_celpip_reading_score:
    label: "Spouse's CELPIP-G Reading"
  spouse_english_celpip_listening_score:
    label: "Spouse's CELPIP-G Listening"
  spouse_english_ielts_speaking_score:
    label: "Spouse's IELTS Speaking"
  spouse_english_ielts_writing_score:
    label: "Spouse's IELTS Writing"
  spouse_english_ielts_reading_score:
    label: "Spouse's IELTS Reading"
  spouse_english_ielts_listening_score:
    label: "Spouse's IELTS Listening"
  spouse_english_pte_speaking_score:
    label: "Spouse's PTE Core Speaking"
  spouse_english_pte_writing_score:
    label: "Spouse's PTE Core Writing"
  spouse_english_pte_reading_score:
    label: "Spouse's PTE Core Reading"
  spouse_english_pte_listening_score:
    label: "Spouse's PTE Core Listening"
  spouse_french_tef_speaking_score:
    label: "Spouse's TEF Canada Speaking"
  spouse_french_tef_writing_score:
    label: "Spouse's TEF Canada Writing"
  spouse_french_tef_reading_score:
    label: "Spouse's TEF Canada Reading"
  spouse_french_tef_listening_score:
    label: "Spouse's TEF Canada Listening"
  spouse_french_tcf_speaking_score:
    label: "Spouse's TCF Canada Speaking"
  spouse_french_tcf_writing_score:
    label: "Spouse's TCF Canada Writing"
  spouse_french_tcf_reading_score:
    label: "Spouse's TCF Canada Reading"
  spouse_french_tcf_listening_score:
    label: "Spouse's TCF Canada Listening" 
  spouse_canadian_experience:
    label: "Spouse's Canadian Experience"
    desc: "How many years of Canadian experience does your spouse or common-law partner have?"
  canadian_experience:
    label: "Canadian Experience"
    desc: "How many years of Canadian experience do you have?"
  foreign_experience:
    label: "Foreign Experience"
    desc: "How many years of foreign experience do you have?"
  certificate_of_qualification:
    label: "Certificate of Qualification"
    desc: "Do you have a certificate of qualification from a Canadian province, territory or federal body?"
    values:
      "yes": "Yes"
      "no": "No"
  with_siblings:
    label: "Siblings in Canada"
    desc: "Do you or your spouse or common law partner have at least one brother or sister living in Canada who is a citizen or permanent resident?"
    values:
      "yes": "Yes"
      "no": "No"
  with_pnp:
    label: "Provincial Nominee Program"
    desc: "Do you have a nomination certificate from a province or territory?"
    values:
      "yes": "Yes"
      "no": "No"
  post_secondary_education_in_canada:
    label: "Post-Secondary Education in Canada"
    desc: "Have you earned a Canadian post-secondary degree, diploma or certificate? If so, how many years did the program take to complete?"
    values:
      "no": "No"
      "1-2": "1-2 years"
      "3+": "3+ years"


  
preprocess:
eval:
  core_human_capital_factors: "Core/Human Capital Factors"
  spouse_factors: "Spouse or Common-law Partner Factors"
  skill_transferability_factors: "Skill Transferability Factors"
  additional_points: "Additional Points"
    
  age: "Age"
  education_level: "Level of Education"
  first_official_language: "First Official Language Proficiency"
  first_official_language_speaking: "Speaking"
  first_official_language_listening: "Listening"
  first_official_language_reading: "Reading"
  first_official_language_writing: "Writing"
  second_official_language: "Second Official Language Proficiency"
  second_official_language_speaking: "Speaking"
  second_official_language_listening: "Listening"
  second_official_language_reading: "Reading"
  second_official_language_writing: "Writing"
  canadian_experience: "Canadian Work Experience"
  spouse_education: "Spouse's Education"
  spouse_language: "Spouse's Language Proficiency"
  spouse_language_speaking: "Speaking"
  spouse_language_listening: "Listening"
  spouse_language_reading: "Reading"
  spouse_language_writing: "Writing"
  spouse_canadian_experience: "Spouse's Canadian Experience"
  foreign_experience: "Foreign Experience"
  education: "Education"
  education.language_proficiency: "Education × Language Proficiency"
  education.canadian_experience: "Education × Canadian Experience"
  foreign_experience.language_proficiency: "Foreign Experience × Language Proficiency"
  foreign_experience.canadian_experience: "Foreign Experience × Canadian Experience"
  certificate_of_qualification: "Qualification × Language Proficiency"

  with_siblings: "Siblings in Canada"
  with_pnp: "Provincial Nominee Program"
  french_language_skills: "French Language Skills"
  post_secondary_education_in_canada: "Post-Secondary Education in Canada"`;export{e as default};