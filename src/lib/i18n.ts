import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Common translations shared across all languages
const commonKeys = {
  // Navigation
  signIn: "Sign In",
  signUp: "Sign Up",
  signOut: "Sign Out",
  getStarted: "Get Started",
  backToHome: "Back to Home",
  
  // Health Check Page
  healthCheck: "Health Check",
  healthCheckSubtitle: "Describe your symptoms, mark pain areas, and enter device readings for a comprehensive assessment",
  symptomsAndPain: "Symptoms & Pain",
  describeFeeling: "Describe what you're feeling",
  whatExperiencing: "What are you experiencing?",
  symptomPlaceholder: "Tell us what you're feeling (e.g., fever, headache, chest pain, fatigue...)",
  painSeverity: "Pain Severity",
  mild: "Mild",
  severe: "Severe",
  electronicHealthScan: "Electronic Health Scan",
  enterReadings: "Enter readings from your devices",
  liveHealthSummary: "Live Health Summary",
  realTimeAnalysis: "Real-time analysis of your inputs",
  noDataYet: "No data entered yet",
  startByDescribing: "Start by describing symptoms or entering readings",
  generateTriage: "Generate Full Triage Assessment",
  analyzing: "Analyzing...",
  resetAll: "Reset All",
  
  // Gadgets
  thermometer: "Thermometer",
  thermometerHint: "Body temperature helps detect fever or infection",
  bloodPressure: "Blood Pressure",
  bpHint: "BP shows how hard your heart is working",
  systolic: "Systolic",
  diastolic: "Diastolic",
  heartRate: "Heart Rate",
  heartRateHint: "Your heart rhythm can indicate stress or health issues",
  oxygenLevel: "Oxygen Level (SpO2)",
  oxygenHint: "Measures oxygen saturation in your blood",
  bloodSugar: "Blood Sugar",
  bloodSugarHint: "Blood glucose levels vary based on meals and activity",
  respiratoryRate: "Respiratory Rate",
  respiratoryHint: "Breathing rate can indicate respiratory issues",
  bmiCalculator: "BMI Calculator",
  bmiHint: "Body Mass Index indicates if your weight is healthy for your height",
  weight: "Weight (kg)",
  height: "Height (cm)",
  
  // Info tooltips
  gadgetInfoText: "This helps understand your condition more accurately.",
  
  // Assessment confidence
  assessmentConfidence: "Assessment Confidence",
  
  // Recheck suggestions
  recheckSuggestion: "Readings can change. If possible, wait a few minutes and recheck for better accuracy.",
  
  // Doctor Summary
  doctorSummary: "Doctor Summary (Quick View)",
  mainSymptom: "Main symptom",
  duration: "Duration",
  bodyAreaAffected: "Body area affected",
  keyReadings: "Key readings",
  
  // Tone selector
  toneNormal: "Normal",
  toneSimple: "Very Simple",
  
  // What affects readings
  whatAffectsReading: "What can affect this reading?",
  affectStress: "Stress",
  affectPain: "Pain",
  affectSleep: "Poor sleep",
  affectFood: "Food",
  affectActivity: "Physical activity",
  affectCaffeine: "Caffeine",
  affectMedication: "Medication",
  affectDehydration: "Dehydration",
  
  // Trust banner
  trustBanner: "NeuLife is designed to guide you, not replace a doctor.",
  
  // Status labels
  low: "Low",
  normal: "Normal",
  elevated: "Elevated",
  high: "High",
  veryHigh: "Very High",
  mildFever: "Mild Fever",
  fever: "Fever",
  highFever: "High Fever",
  critical: "Critical",
  underweight: "Underweight",
  overweight: "Overweight",
  
  // Triage results
  likelySafe: "Likely Safe",
  monitorRest: "Monitor & Rest",
  consultSoon: "Consult Doctor Soon",
  urgentCare: "Seek Urgent Care",
  
  // Disclaimers
  notDiagnosis: "This is guidance, not a medical diagnosis.",
  readingsAffected: "Readings can be affected by stress, activity, food, and sleep.",
  ifWorsens: "If symptoms worsen, please consult a healthcare professional.",
  
  // Voice Input
  voiceInput: {
    listening: "Listening...",
    processing: "Processing...",
    microphoneError: "Failed to access microphone",
    unclearMessage: "I may not have understood that clearly. You can edit or try again.",
    reviewText: "Please review the text before sending",
    processingError: "Could not process audio. Please try again or type instead.",
  },
  
  // AI Chat
  chat: {
    title: "NeuLife Medical AI",
    subtitle: "Ask health questions in simple words",
    welcome: "Welcome to NeuLife AI",
    welcomeMessage: "I'm here to help you understand health topics in simple terms. Ask me anything about symptoms, wellness, or general health questions.",
    tryAsking: "Try asking:",
    placeholder: "Type your health question...",
    voiceHelper: "Use voice to type, then review and press Send",
    clearInput: "Clear",
    important: "Important:",
    disclaimer: "This AI provides general health information only. It does not diagnose conditions or prescribe treatments. Always consult a healthcare professional for medical advice.",
    loginRequired: "Continue with NeuLife",
    loginMessage: "You've used your 10 free messages. Sign in to unlock unlimited access to NeuLife AI and all health features.",
    signIn: "Sign In to Continue",
    freeMessages: "Free messages remaining: {{count}}",
    tooManyRequests: "Too many requests. Please wait a moment and try again.",
    creditsExhausted: "AI credits exhausted. Please try again later.",
    failedResponse: "Failed to get response",
    sendFailed: "Failed to send message",
  },
};

const resources = {
  en: {
    translation: {
      ...commonKeys,
      
      // Landing
      forYourHealth: 'Built by young innovators. Trusted for every life.',
      startTriage: 'Start My Health Check',
      learnMore: 'How NeuLife Works',
      heroTitle: 'Your Health. Simplified by AI, Guided with Care.',
      heroSubtitle: 'Get instant, safe medical triage and personalized health insights — in your language, anytime you need help.',
      
      // Stats
      stat1Title: '24/7',
      stat1Desc: 'AI Health Assistant – Always here when you need answers',
      stat2Title: '100%',
      stat2Desc: 'Your Data, Fully Yours – Encrypted, protected, never shared',
      stat3Title: 'Instant',
      stat3Desc: 'Medical Insight – Understand symptoms in seconds',
      stat4Title: 'Smart',
      stat4Desc: 'Safe Analysis – Backed by verified medical data',
      
      // Features Section
      featuresTitle: 'Where Artificial Intelligence Meets Human Empathy',
      featuresSubtitle: 'NeuLife blends the precision of AI with medical understanding, delivering safe, multilingual healthcare support — made to be understood by everyone.',
      
      // Feature Cards
      aiTriageTitle: '24/7 Health Support',
      aiTriageDescription: "Get help anytime — midnight fever or morning doubt, we're here for you.",
      smartHealthTitle: 'Smart Symptom Analysis',
      smartHealthDescription: 'Know what your symptoms might mean, in seconds, in your own language.',
      secureDataTitle: 'Privacy First',
      secureDataDescription: 'Your health history stays encrypted and fully under your control.',
      
      // CTA Section
      cta: {
        title: 'Your New Health Companion Is Here.',
        description: 'Join NeuLife and experience healthcare that listens, learns, and speaks your language. Smarter, safer, and always by your side.',
        button: "Join NeuLife — It's Free"
      },
      
      footerText: 'Intelligent. Secure. Compassionate Healthcare for Every Life.',
      footerCredit: 'Made with ❤️ by young innovators — bridging medicine and AI for India and the world.',
      
      requestHealthCard: "Request Health Card",
      tryAITriage: "Try AI Triage",
      
      // Additional Features
      uniqueHealthCard: "Unique Health Card",
      uniqueHealthCardDesc: "Get your personal Health Card ID with format HC-COUNTRY-DATE-CODE. Secure, verifiable, and government-ready.",
      aiMedicalTriage: "AI Medical Triage",
      aiMedicalTriageDesc: "Evidence-based triage for human and animal health. Get instant guidance on symptoms with confidence scores and action plans.",
      privacyConsent: "Privacy & Consent",
      privacyConsentDesc: "Full control over your data with explicit consent management. Encrypted storage and transparent data usage policies.",
      
      // Auth
      welcomeAuth: "Welcome to NeuLife",
      signInAccess: "Sign in to access your health dashboard",
      fullName: "Full Name",
      email: "Email",
      password: "Password",
      creatingAccount: "Creating account...",
      signingIn: "Signing in...",
      createAccount: "Create Account",
      dontHaveAccount: "Don't have an account?",
      
      // Dashboard
      welcomeUser: "Welcome",
      manageHealthCard: "Manage your health card and profile",
      noHealthCard: "No Health Card Yet",
      noHealthCardDesc: "Create your unique Health Card to start tracking your health journey",
      yourHealthCard: "Your Health Card",
      healthCardID: "Health Card ID",
      status: "Status",
      issuedOn: "Issued On",
      provisional: "Provisional",
      verified: "Verified",
      
      // Triage
      triageTitle: "Get Evidence-Based Health Guidance",
      triageSubtitle: "Describe your symptoms and receive AI-powered triage with confidence scores and action plans",
      describeSymptoms: "Describe Your Symptoms",
      symptomsPlaceholder: "Example: I have fever, body ache and red rash since yesterday...",
      whoIsThisFor: "Who is this for?",
      human: "Human",
      animal: "Animal",
      animalType: "Animal Type",
      age: "Age",
      sex: "Sex",
      male: "Male",
      female: "Female",
      other: "Other",
      severity: "Severity (1-10)",
      symptomOnset: "Symptom Onset",
      getTriageAssessment: "Get Triage Assessment",
      analyzingSymptoms: "Analyzing Symptoms...",
      triageAssessment: "Triage Assessment",
      
      // Admin
      adminDashboard: "Admin Dashboard",
      pendingVerifications: "Pending Verifications",
      totalUsers: "Total Users",
      totalHealthCards: "Total Health Cards",
      recentActivity: "Recent Activity",
      approveCard: "Approve",
      rejectCard: "Reject",
      
      // Voice
      startVoiceAssistant: "Start Voice Assistant",
      stopVoiceAssistant: "Stop Voice Assistant",
      listening: "Listening...",
      speaking: "Speaking...",
      
      // Simple tone versions
      simple: {
        elevated: "A little higher than usual",
        high: "Higher than it should be",
        low: "Lower than usual",
        fever: "You have a fever",
        mildFever: "You have a slight fever",
        normal: "Looking good!",
      }
    }
  },
  hi: {
    translation: {
      ...commonKeys,
      // Override with Hindi translations
      signIn: "साइन इन करें",
      signUp: "साइन अप करें",
      signOut: "साइन आउट",
      getStarted: "शुरू करें",
      backToHome: "होम पर वापस जाएं",
      
      // Health Check Page
      healthCheck: "स्वास्थ्य जांच",
      healthCheckSubtitle: "व्यापक मूल्यांकन के लिए अपने लक्षण बताएं, दर्द के क्षेत्र चिह्नित करें, और डिवाइस रीडिंग दर्ज करें",
      symptomsAndPain: "लक्षण और दर्द",
      describeFeeling: "बताएं आप कैसा महसूस कर रहे हैं",
      whatExperiencing: "आप क्या अनुभव कर रहे हैं?",
      symptomPlaceholder: "बताएं आप कैसा महसूस कर रहे हैं (जैसे, बुखार, सिरदर्द, छाती में दर्द, थकान...)",
      painSeverity: "दर्द की तीव्रता",
      mild: "हल्का",
      severe: "गंभीर",
      electronicHealthScan: "इलेक्ट्रॉनिक स्वास्थ्य स्कैन",
      enterReadings: "अपने उपकरणों से रीडिंग दर्ज करें",
      liveHealthSummary: "लाइव स्वास्थ्य सारांश",
      realTimeAnalysis: "आपके इनपुट का रियल-टाइम विश्लेषण",
      noDataYet: "अभी तक कोई डेटा नहीं",
      startByDescribing: "लक्षण बताकर या रीडिंग दर्ज करके शुरू करें",
      generateTriage: "पूर्ण ट्राइएज मूल्यांकन प्राप्त करें",
      analyzing: "विश्लेषण हो रहा है...",
      resetAll: "सब रीसेट करें",
      
      // Gadgets
      thermometer: "थर्मामीटर",
      thermometerHint: "शरीर का तापमान बुखार या संक्रमण का पता लगाने में मदद करता है",
      bloodPressure: "रक्तचाप",
      bpHint: "BP दिखाता है कि आपका दिल कितनी मेहनत कर रहा है",
      systolic: "सिस्टोलिक",
      diastolic: "डायस्टोलिक",
      heartRate: "हृदय गति",
      heartRateHint: "आपकी हृदय लय तनाव या स्वास्थ्य समस्याओं का संकेत दे सकती है",
      oxygenLevel: "ऑक्सीजन स्तर (SpO2)",
      oxygenHint: "आपके रक्त में ऑक्सीजन संतृप्ति मापता है",
      bloodSugar: "रक्त शर्करा",
      bloodSugarHint: "ब्लड ग्लूकोज स्तर भोजन और गतिविधि के आधार पर बदलता है",
      respiratoryRate: "श्वसन दर",
      respiratoryHint: "श्वास दर श्वसन समस्याओं का संकेत दे सकती है",
      bmiCalculator: "BMI कैलकुलेटर",
      bmiHint: "बॉडी मास इंडेक्स बताता है कि आपका वजन आपकी ऊंचाई के लिए स्वस्थ है या नहीं",
      weight: "वजन (किग्रा)",
      height: "ऊंचाई (सेमी)",
      
      gadgetInfoText: "यह आपकी स्थिति को और सटीक रूप से समझने में मदद करता है।",
      assessmentConfidence: "मूल्यांकन विश्वास",
      recheckSuggestion: "रीडिंग बदल सकती हैं। यदि संभव हो, कुछ मिनट प्रतीक्षा करें और बेहतर सटीकता के लिए दोबारा जांचें।",
      doctorSummary: "डॉक्टर सारांश (त्वरित दृश्य)",
      mainSymptom: "मुख्य लक्षण",
      duration: "अवधि",
      bodyAreaAffected: "प्रभावित शरीर क्षेत्र",
      keyReadings: "प्रमुख रीडिंग",
      toneNormal: "सामान्य",
      toneSimple: "बहुत सरल",
      whatAffectsReading: "इस रीडिंग को क्या प्रभावित कर सकता है?",
      affectStress: "तनाव",
      affectPain: "दर्द",
      affectSleep: "खराब नींद",
      affectFood: "भोजन",
      affectActivity: "शारीरिक गतिविधि",
      affectCaffeine: "कैफीन",
      affectMedication: "दवाई",
      affectDehydration: "निर्जलीकरण",
      trustBanner: "NeuLife आपका मार्गदर्शन करने के लिए डिज़ाइन किया गया है, डॉक्टर की जगह लेने के लिए नहीं।",
      
      // Landing
      forYourHealth: 'युवा नवप्रवर्तकों द्वारा निर्मित। हर जीवन के लिए विश्वसनीय।',
      startTriage: 'अपनी स्वास्थ्य जांच शुरू करें',
      learnMore: 'न्यूलाइफ कैसे काम करता है',
      heroTitle: 'आपका स्वास्थ्य। एआई द्वारा सरल, देखभाल के साथ निर्देशित।',
      heroSubtitle: 'तत्काल, सुरक्षित चिकित्सा ट्राइएज और व्यक्तिगत स्वास्थ्य अंतर्दृष्टि प्राप्त करें — आपकी भाषा में, जब भी आपको मदद की आवश्यकता हो।',
      
      stat1Title: '24/7',
      stat1Desc: 'एआई स्वास्थ्य सहायक – जब आपको उत्तर चाहिए तो हमेशा यहाँ',
      stat2Title: '100%',
      stat2Desc: 'आपका डेटा, पूरी तरह आपका – एन्क्रिप्टेड, सुरक्षित, कभी साझा नहीं',
      stat3Title: 'तुरंत',
      stat3Desc: 'चिकित्सा अंतर्दृष्टि – सेकंडों में लक्षण समझें',
      stat4Title: 'स्मार्ट',
      stat4Desc: 'सुरक्षित विश्लेषण – सत्यापित चिकित्सा डेटा द्वारा समर्थित',
      
      featuresTitle: 'जहां कृत्रिम बुद्धिमत्ता मानवीय सहानुभूति से मिलती है',
      featuresSubtitle: 'न्यूलाइफ एआई की सटीकता को चिकित्सा समझ के साथ मिलाता है, सुरक्षित, बहुभाषी स्वास्थ्य सहायता प्रदान करता है — सभी के लिए समझने योग्य।',
      
      aiTriageTitle: '24/7 स्वास्थ्य सहायता',
      aiTriageDescription: 'किसी भी समय मदद पाएं — आधी रात का बुखार हो या सुबह का संदेह, हम आपके लिए यहाँ हैं।',
      smartHealthTitle: 'स्मार्ट लक्षण विश्लेषण',
      smartHealthDescription: 'जानें कि आपके लक्षणों का क्या अर्थ हो सकता है, सेकंडों में, आपकी अपनी भाषा में।',
      secureDataTitle: 'गोपनीयता पहले',
      secureDataDescription: 'आपका स्वास्थ्य इतिहास एन्क्रिप्टेड रहता है और पूरी तरह आपके नियंत्रण में।',
      
      cta: {
        title: 'आपका नया स्वास्थ्य साथी यहाँ है।',
        description: 'न्यूलाइफ से जुड़ें और स्वास्थ्य सेवा का अनुभव करें जो सुनती है, सीखती है और आपकी भाषा बोलती है। स्मार्ट, सुरक्षित, और हमेशा आपके साथ।',
        button: 'न्यूलाइफ से जुड़ें — यह मुफ़्त है'
      },
      
      footerText: 'बुद्धिमान। सुरक्षित। हर जीवन के लिए दयालु स्वास्थ्य सेवा।',
      footerCredit: '❤️ के साथ युवा नवप्रवर्तकों द्वारा बनाया गया — भारत और दुनिया के लिए चिकित्सा और एआई को जोड़ना।',
      
      welcomeAuth: "न्यूलाइफ में आपका स्वागत है",
      signInAccess: "अपने स्वास्थ्य डैशबोर्ड तक पहुंचने के लिए साइन इन करें",
      fullName: "पूरा नाम",
      email: "ईमेल",
      password: "पासवर्ड",
      creatingAccount: "खाता बनाया जा रहा है...",
      signingIn: "साइन इन हो रहा है...",
      createAccount: "खाता बनाएं",
      dontHaveAccount: "खाता नहीं है?",
      
      welcomeUser: "स्वागत है",
      manageHealthCard: "अपना हेल्थ कार्ड और प्रोफ़ाइल प्रबंधित करें",
      noHealthCard: "अभी तक कोई हेल्थ कार्ड नहीं",
      noHealthCardDesc: "अपनी स्वास्थ्य यात्रा को ट्रैक करना शुरू करने के लिए अपना अनूठा हेल्थ कार्ड बनाएं",
      yourHealthCard: "आपका हेल्थ कार्ड",
      healthCardID: "हेल्थ कार्ड आईडी",
      status: "स्थिति",
      issuedOn: "जारी करने की तारीख",
      provisional: "अस्थायी",
      verified: "सत्यापित",
      
      triageTitle: "साक्ष्य-आधारित स्वास्थ्य मार्गदर्शन प्राप्त करें",
      triageSubtitle: "अपने लक्षणों का वर्णन करें और विश्वास स्कोर के साथ एआई-संचालित ट्राइएज प्राप्त करें",
      describeSymptoms: "अपने लक्षणों का वर्णन करें",
      symptomsPlaceholder: "उदाहरण: मुझे कल से बुखार, शरीर में दर्द और लाल चकत्ते हैं...",
      whoIsThisFor: "यह किसके लिए है?",
      human: "मानव",
      animal: "पशु",
      animalType: "पशु का प्रकार",
      age: "उम्र",
      sex: "लिंग",
      male: "पुरुष",
      female: "महिला",
      other: "अन्य",
      severity: "गंभीरता (1-10)",
      symptomOnset: "लक्षण शुरुआत",
      getTriageAssessment: "ट्राइएज मूल्यांकन प्राप्त करें",
      analyzingSymptoms: "लक्षणों का विश्लेषण...",
      triageAssessment: "ट्राइएज मूल्यांकन",
      
      adminDashboard: "एडमिन डैशबोर्ड",
      pendingVerifications: "लंबित सत्यापन",
      totalUsers: "कुल उपयोगकर्ता",
      totalHealthCards: "कुल हेल्थ कार्ड",
      recentActivity: "हालिया गतिविधि",
      approveCard: "स्वीकृत करें",
      rejectCard: "अस्वीकार करें",
      
      startVoiceAssistant: "वॉयस असिस्टेंट शुरू करें",
      stopVoiceAssistant: "वॉयस असिस्टेंट बंद करें",
      listening: "सुन रहा है...",
      speaking: "बोल रहा है...",
      
      requestHealthCard: "हेल्थ कार्ड का अनुरोध करें",
      tryAITriage: "एआई ट्राइएज आज़माएं",
      uniqueHealthCard: "अनूठा हेल्थ कार्ड",
      uniqueHealthCardDesc: "HC-देश-तारीख-कोड प्रारूप के साथ अपना व्यक्तिगत हेल्थ कार्ड आईडी प्राप्त करें।",
      aiMedicalTriage: "एआई चिकित्सा ट्राइएज",
      aiMedicalTriageDesc: "मानव और पशु स्वास्थ्य के लिए साक्ष्य-आधारित ट्राइएज।",
      privacyConsent: "गोपनीयता और सहमति",
      privacyConsentDesc: "स्पष्ट सहमति प्रबंधन के साथ अपने डेटा पर पूर्ण नियंत्रण।",
      
      likelySafe: "संभवतः सुरक्षित",
      monitorRest: "निगरानी करें और आराम करें",
      consultSoon: "जल्द डॉक्टर से मिलें",
      urgentCare: "तुरंत चिकित्सा लें",
      notDiagnosis: "यह मार्गदर्शन है, चिकित्सा निदान नहीं।",
      readingsAffected: "रीडिंग तनाव, गतिविधि, भोजन और नींद से प्रभावित हो सकती है।",
      ifWorsens: "यदि लक्षण बिगड़ते हैं, तो कृपया स्वास्थ्य पेशेवर से परामर्श लें।",
    }
  },
  te: {
    translation: {
      ...commonKeys,
      signIn: "సైన్ ఇన్",
      signUp: "సైన్ అప్",
      signOut: "సైన్ అవుట్",
      getStarted: "ప్రారంభించండి",
      backToHome: "హోమ్‌కు తిరిగి వెళ్ళు",
      
      healthCheck: "ఆరోగ్య పరీక్ష",
      healthCheckSubtitle: "మీ లక్షణాలను వివరించండి, నొప్పి ప్రాంతాలను గుర్తించండి మరియు సమగ్ర మూల్యాంకనం కోసం పరికర రీడింగ్‌లను నమోదు చేయండి",
      symptomsAndPain: "లక్షణాలు & నొప్పి",
      describeFeeling: "మీరు ఎలా అనుభవిస్తున్నారో వివరించండి",
      thermometer: "థర్మామీటర్",
      bloodPressure: "రక్తపోటు",
      heartRate: "హృదయ స్పందన రేటు",
      oxygenLevel: "ఆక్సిజన్ స్థాయి (SpO2)",
      bloodSugar: "రక్త చక్కెర",
      bmiCalculator: "BMI కాలిక్యులేటర్",
      
      gadgetInfoText: "ఇది మీ పరిస్థితిని మరింత ఖచ్చితంగా అర్థం చేసుకోవడానికి సహాయపడుతుంది.",
      assessmentConfidence: "మూల్యాంకన విశ్వాసం",
      recheckSuggestion: "రీడింగ్‌లు మారవచ్చు. వీలైతే, కొన్ని నిమిషాలు వేచి ఉండి మెరుగైన ఖచ్చితత్వం కోసం మళ్ళీ తనిఖీ చేయండి.",
      doctorSummary: "వైద్యుడి సారాంశం (శీఘ్ర వీక్షణ)",
      trustBanner: "NeuLife మీకు మార్గదర్శకత్వం చేయడానికి రూపొందించబడింది, వైద్యుడిని భర్తీ చేయడానికి కాదు.",
      
      forYourHealth: 'యువ ఆవిష్కర్తలచే నిర్మించబడింది. ప్రతి జీవితం కోసం విశ్వసనీయం.',
      startTriage: 'నా ఆరోగ్య పరీక్ష ప్రారంభించండి',
      heroTitle: 'మీ ఆరోగ్యం. AI ద్వారా సరళీకృతం, సంరక్షణతో మార్గదర్శకత్వం.',
      heroSubtitle: 'తక్షణ, సురక్షిత వైద్య ట్రియాజ్ మరియు వ్యక్తిగతీకరించిన ఆరోగ్య అంతర్దృష్టులను పొందండి — మీ భాషలో, మీకు సహాయం అవసరమైనప్పుడు.',
      
      welcomeAuth: "NeuLife కి స్వాగతం",
      fullName: "పూర్తి పేరు",
      email: "ఇమెయిల్",
      password: "పాస్‌వర్డ్",
      welcomeUser: "స్వాగతం",
      yourHealthCard: "మీ హెల్త్ కార్డ్",
      
      likelySafe: "బహుశా సురక్షితం",
      monitorRest: "పర్యవేక్షించండి & విశ్రాంతి తీసుకోండి",
      consultSoon: "త్వరలో వైద్యుడిని సంప్రదించండి",
      urgentCare: "అత్యవసర సంరక్షణ కోరండి",
    }
  },
  ta: {
    translation: {
      ...commonKeys,
      signIn: "உள்நுழைக",
      signUp: "பதிவு செய்க",
      signOut: "வெளியேறு",
      getStarted: "தொடங்குங்கள்",
      backToHome: "முகப்புக்குத் திரும்பு",
      
      healthCheck: "சுகாதார பரிசோதனை",
      healthCheckSubtitle: "உங்கள் அறிகுறிகளை விவரிக்கவும், வலி பகுதிகளை குறிக்கவும், விரிவான மதிப்பீட்டிற்கு சாதன அளவீடுகளை உள்ளிடவும்",
      symptomsAndPain: "அறிகுறிகள் & வலி",
      describeFeeling: "நீங்கள் என்ன உணர்கிறீர்கள் என்பதை விவரிக்கவும்",
      thermometer: "வெப்பமானி",
      bloodPressure: "இரத்த அழுத்தம்",
      heartRate: "இதய துடிப்பு விகிதம்",
      oxygenLevel: "ஆக்சிஜன் நிலை (SpO2)",
      bloodSugar: "இரத்த சர்க்கரை",
      bmiCalculator: "BMI கால்குலேட்டர்",
      
      gadgetInfoText: "இது உங்கள் நிலையை மிகவும் துல்லியமாக புரிந்துகொள்ள உதவுகிறது.",
      assessmentConfidence: "மதிப்பீட்டு நம்பிக்கை",
      recheckSuggestion: "அளவீடுகள் மாறலாம். முடிந்தால், சில நிமிடங்கள் காத்திருந்து சிறந்த துல்லியத்திற்கு மீண்டும் சரிபார்க்கவும்.",
      doctorSummary: "மருத்துவர் சுருக்கம் (விரைவு பார்வை)",
      trustBanner: "NeuLife உங்களுக்கு வழிகாட்ட வடிவமைக்கப்பட்டுள்ளது, மருத்துவரை மாற்றுவதற்கு அல்ல.",
      
      forYourHealth: 'இளம் புதுமையாளர்களால் கட்டப்பட்டது. ஒவ்வொரு வாழ்க்கைக்கும் நம்பகமானது.',
      startTriage: 'என் சுகாதார சோதனையைத் தொடங்கு',
      heroTitle: 'உங்கள் ஆரோக்கியம். AI மூலம் எளிமைப்படுத்தப்பட்டது, அக்கறையுடன் வழிநடத்தப்படுகிறது.',
      
      welcomeAuth: "NeuLife க்கு வரவேற்கிறோம்",
      fullName: "முழு பெயர்",
      email: "மின்னஞ்சல்",
      password: "கடவுச்சொல்",
      welcomeUser: "வரவேற்பு",
      yourHealthCard: "உங்கள் ஹெல்த் கார்டு",
      
      likelySafe: "பாதுகாப்பானது போல்",
      monitorRest: "கண்காணித்து ஓய்வெடுங்கள்",
      consultSoon: "விரைவில் மருத்துவரை அணுகுங்கள்",
      urgentCare: "அவசர சிகிச்சை பெறுங்கள்",
    }
  },
  kn: {
    translation: {
      ...commonKeys,
      signIn: "ಸೈನ್ ಇನ್",
      signUp: "ಸೈನ್ ಅಪ್",
      signOut: "ಸೈನ್ ಔಟ್",
      getStarted: "ಪ್ರಾರಂಭಿಸಿ",
      
      healthCheck: "ಆರೋಗ್ಯ ತಪಾಸಣೆ",
      thermometer: "ಥರ್ಮಾಮೀಟರ್",
      bloodPressure: "ರಕ್ತದೊತ್ತಡ",
      heartRate: "ಹೃದಯ ಬಡಿತ ದರ",
      oxygenLevel: "ಆಮ್ಲಜನಕ ಮಟ್ಟ (SpO2)",
      bloodSugar: "ರಕ್ತದ ಸಕ್ಕರೆ",
      
      gadgetInfoText: "ಇದು ನಿಮ್ಮ ಸ್ಥಿತಿಯನ್ನು ಹೆಚ್ಚು ನಿಖರವಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
      trustBanner: "NeuLife ನಿಮಗೆ ಮಾರ್ಗದರ್ಶನ ನೀಡಲು ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ, ವೈದ್ಯರನ್ನು ಬದಲಿಸಲು ಅಲ್ಲ.",
      
      forYourHealth: 'ಯುವ ಆವಿಷ್ಕಾರಕರಿಂದ ನಿರ್ಮಿಸಲಾಗಿದೆ. ಪ್ರತಿ ಜೀವನಕ್ಕೂ ವಿಶ್ವಾಸಾರ್ಹ.',
      heroTitle: 'ನಿಮ್ಮ ಆರೋಗ್ಯ. AI ನಿಂದ ಸರಳೀಕೃತ, ಕಾಳಜಿಯೊಂದಿಗೆ ಮಾರ್ಗದರ್ಶನ.',
      welcomeAuth: "NeuLife ಗೆ ಸ್ವಾಗತ",
    }
  },
  ml: {
    translation: {
      ...commonKeys,
      signIn: "സൈൻ ഇൻ",
      signUp: "സൈൻ അപ്പ്",
      signOut: "സൈൻ ഔട്ട്",
      getStarted: "ആരംഭിക്കുക",
      
      healthCheck: "ആരോഗ്യ പരിശോധന",
      thermometer: "തെർമോമീറ്റർ",
      bloodPressure: "രക്തസമ്മർദ്ദം",
      heartRate: "ഹൃദയമിടിപ്പ് നിരക്ക്",
      oxygenLevel: "ഓക്സിജൻ നില (SpO2)",
      bloodSugar: "രക്തത്തിലെ പഞ്ചസാര",
      
      gadgetInfoText: "ഇത് നിങ്ങളുടെ അവസ്ഥ കൂടുതൽ കൃത്യമായി മനസ്സിലാക്കാൻ സഹായിക്കുന്നു.",
      trustBanner: "NeuLife നിങ്ങളെ നയിക്കാൻ രൂപകൽപ്പന ചെയ്തിരിക്കുന്നു, ഡോക്ടറെ മാറ്റിസ്ഥാപിക്കാനല്ല.",
      
      forYourHealth: 'യുവ നവീകരണ ചിന്തകർ നിർമ്മിച്ചത്. എല്ലാ ജീവിതത്തിനും വിശ്വസനീയം.',
      heroTitle: 'നിങ്ങളുടെ ആരോഗ്യം. AI വഴി ലളിതമാക്കി, കരുതലോടെ നയിക്കുന്നു.',
      welcomeAuth: "NeuLife ലേക്ക് സ്വാഗതം",
    }
  },
  mr: {
    translation: {
      ...commonKeys,
      signIn: "साइन इन करा",
      signUp: "साइन अप करा",
      signOut: "साइन आउट",
      getStarted: "सुरू करा",
      
      healthCheck: "आरोग्य तपासणी",
      thermometer: "थर्मामीटर",
      bloodPressure: "रक्तदाब",
      heartRate: "हृदय गती",
      oxygenLevel: "ऑक्सिजन पातळी (SpO2)",
      bloodSugar: "रक्त साखर",
      
      gadgetInfoText: "हे तुमची स्थिती अधिक अचूकपणे समजून घेण्यास मदत करते.",
      trustBanner: "NeuLife तुम्हाला मार्गदर्शन करण्यासाठी डिझाइन केले आहे, डॉक्टरांची जागा घेण्यासाठी नाही.",
      
      forYourHealth: 'तरुण नवसंशोधकांनी बांधले. प्रत्येक जीवनासाठी विश्वासार्ह.',
      heroTitle: 'तुमचे आरोग्य. AI द्वारे सुलभ, काळजीने मार्गदर्शित.',
      welcomeAuth: "NeuLife मध्ये आपले स्वागत आहे",
    }
  },
  gu: {
    translation: {
      ...commonKeys,
      signIn: "સાઇન ઇન",
      signUp: "સાઇન અપ",
      signOut: "સાઇન આઉટ",
      getStarted: "શરૂ કરો",
      
      healthCheck: "આરોગ્ય તપાસ",
      thermometer: "થર્મોમીટર",
      bloodPressure: "બ્લડ પ્રેશર",
      heartRate: "હૃદય દર",
      oxygenLevel: "ઓક્સિજન સ્તર (SpO2)",
      bloodSugar: "બ્લડ સુગર",
      
      gadgetInfoText: "આ તમારી સ્થિતિને વધુ સચોટ રીતે સમજવામાં મદદ કરે છે.",
      trustBanner: "NeuLife તમને માર્ગદર્શન આપવા માટે ડિઝાઇન કરવામાં આવ્યું છે, ડૉક્ટરને બદલવા માટે નહીં.",
      
      forYourHealth: 'યુવા નવીનતાકારો દ્વારા બનાવેલ. દરેક જીવન માટે વિશ્વાસપાત્ર.',
      heroTitle: 'તમારું સ્વાસ્થ્ય. AI દ્વારા સરળ, કાળજી સાથે માર્ગદર્શિત.',
      welcomeAuth: "NeuLife માં આપનું સ્વાગત છે",
    }
  },
  bn: {
    translation: {
      ...commonKeys,
      signIn: "সাইন ইন",
      signUp: "সাইন আপ",
      signOut: "সাইন আউট",
      getStarted: "শুরু করুন",
      
      healthCheck: "স্বাস্থ্য পরীক্ষা",
      thermometer: "থার্মোমিটার",
      bloodPressure: "রক্তচাপ",
      heartRate: "হৃদস্পন্দনের হার",
      oxygenLevel: "অক্সিজেন স্তর (SpO2)",
      bloodSugar: "রক্তে শর্করা",
      
      gadgetInfoText: "এটি আপনার অবস্থা আরও সঠিকভাবে বুঝতে সাহায্য করে।",
      trustBanner: "NeuLife আপনাকে গাইড করার জন্য ডিজাইন করা হয়েছে, ডাক্তারের বিকল্প নয়।",
      
      forYourHealth: 'তরুণ উদ্ভাবকদের দ্বারা নির্মিত। প্রতিটি জীবনের জন্য বিশ্বস্ত।',
      heroTitle: 'আপনার স্বাস্থ্য। AI দ্বারা সরলীকৃত, যত্নের সাথে নির্দেশিত।',
      welcomeAuth: "NeuLife-এ স্বাগতম",
    }
  },
  pa: {
    translation: {
      ...commonKeys,
      signIn: "ਸਾਈਨ ਇਨ",
      signUp: "ਸਾਈਨ ਅੱਪ",
      signOut: "ਸਾਈਨ ਆਊਟ",
      getStarted: "ਸ਼ੁਰੂ ਕਰੋ",
      
      healthCheck: "ਸਿਹਤ ਜਾਂਚ",
      thermometer: "ਥਰਮਾਮੀਟਰ",
      bloodPressure: "ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ",
      heartRate: "ਦਿਲ ਦੀ ਧੜਕਣ ਦੀ ਦਰ",
      oxygenLevel: "ਆਕਸੀਜਨ ਪੱਧਰ (SpO2)",
      bloodSugar: "ਬਲੱਡ ਸ਼ੂਗਰ",
      
      gadgetInfoText: "ਇਹ ਤੁਹਾਡੀ ਸਥਿਤੀ ਨੂੰ ਵਧੇਰੇ ਸਹੀ ਢੰਗ ਨਾਲ ਸਮਝਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।",
      trustBanner: "NeuLife ਤੁਹਾਨੂੰ ਮਾਰਗਦਰਸ਼ਨ ਕਰਨ ਲਈ ਤਿਆਰ ਕੀਤਾ ਗਿਆ ਹੈ, ਡਾਕਟਰ ਦੀ ਥਾਂ ਲੈਣ ਲਈ ਨਹੀਂ।",
      
      forYourHealth: 'ਨੌਜਵਾਨ ਨਵੀਨਤਾਕਾਰਾਂ ਦੁਆਰਾ ਬਣਾਇਆ ਗਿਆ। ਹਰ ਜੀਵਨ ਲਈ ਭਰੋਸੇਯੋਗ।',
      heroTitle: 'ਤੁਹਾਡੀ ਸਿਹਤ। AI ਦੁਆਰਾ ਸਰਲ, ਦੇਖਭਾਲ ਨਾਲ ਮਾਰਗਦਰਸ਼ਨ।',
      welcomeAuth: "NeuLife ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ",
    }
  },
  or: {
    translation: {
      ...commonKeys,
      signIn: "ସାଇନ୍ ଇନ୍",
      signUp: "ସାଇନ୍ ଅପ୍",
      signOut: "ସାଇନ୍ ଆଉଟ୍",
      getStarted: "ଆରମ୍ଭ କରନ୍ତୁ",
      
      healthCheck: "ସ୍ୱାସ୍ଥ୍ୟ ଯାଞ୍ଚ",
      thermometer: "ଥର୍ମୋମିଟର",
      bloodPressure: "ରକ୍ତଚାପ",
      heartRate: "ହୃଦୟ ସ୍ପନ୍ଦନ ହାର",
      oxygenLevel: "ଅମ୍ଳଜାନ ସ୍ତର (SpO2)",
      bloodSugar: "ରକ୍ତ ଶର୍କରା",
      
      gadgetInfoText: "ଏହା ଆପଣଙ୍କ ସ୍ଥିତିକୁ ଅଧିକ ସଠିକ ଭାବରେ ବୁଝିବାରେ ସାହାଯ୍ୟ କରେ।",
      trustBanner: "NeuLife ଆପଣଙ୍କୁ ମାର୍ଗଦର୍ଶନ କରିବା ପାଇଁ ଡିଜାଇନ୍ କରାଯାଇଛି, ଡାକ୍ତରଙ୍କ ବଦଳରେ ନୁହେଁ।",
      
      forYourHealth: 'ଯୁବ ଉଦ୍ଭାବକମାନଙ୍କ ଦ୍ୱାରା ନିର୍ମିତ। ପ୍ରତ୍ୟେକ ଜୀବନ ପାଇଁ ବିଶ୍ୱସ୍ତ।',
      welcomeAuth: "NeuLife କୁ ସ୍ୱାଗତ",
    }
  },
  as: {
    translation: {
      ...commonKeys,
      signIn: "চাইন ইন",
      signUp: "চাইন আপ",
      signOut: "চাইন আউট",
      getStarted: "আৰম্ভ কৰক",
      
      healthCheck: "স্বাস্থ্য পৰীক্ষা",
      thermometer: "থাৰ্মোমিটাৰ",
      bloodPressure: "ৰক্তচাপ",
      heartRate: "হৃদস্পন্দনৰ হাৰ",
      oxygenLevel: "অক্সিজেন স্তৰ (SpO2)",
      bloodSugar: "ৰক্তত শৰ্কৰা",
      
      gadgetInfoText: "এইটোৱে আপোনাৰ অৱস্থা অধিক সঠিকভাৱে বুজিবলৈ সহায় কৰে।",
      trustBanner: "NeuLife আপোনাক গাইড কৰিবলৈ ডিজাইন কৰা হৈছে, ডাক্তৰৰ বিকল্প নহয়।",
      
      forYourHealth: 'যুৱ উদ্ভাৱকসকলে নিৰ্মাণ কৰা। প্ৰতিটো জীৱনৰ বাবে বিশ্বাসযোগ্য।',
      welcomeAuth: "NeuLife লৈ স্বাগতম",
    }
  },
  ur: {
    translation: {
      ...commonKeys,
      signIn: "سائن ان",
      signUp: "سائن اپ",
      signOut: "سائن آؤٹ",
      getStarted: "شروع کریں",
      
      healthCheck: "صحت کی جانچ",
      thermometer: "تھرمامیٹر",
      bloodPressure: "بلڈ پریشر",
      heartRate: "دل کی دھڑکن کی شرح",
      oxygenLevel: "آکسیجن کی سطح (SpO2)",
      bloodSugar: "خون میں شکر",
      
      gadgetInfoText: "یہ آپ کی حالت کو زیادہ درست طریقے سے سمجھنے میں مدد کرتا ہے۔",
      trustBanner: "NeuLife آپ کی رہنمائی کے لیے ڈیزائن کیا گیا ہے، ڈاکٹر کی جگہ لینے کے لیے نہیں۔",
      
      forYourHealth: 'نوجوان اختراع کاروں نے بنایا۔ ہر زندگی کے لیے قابل اعتماد۔',
      heroTitle: 'آپ کی صحت۔ AI کے ذریعے آسان، دیکھ بھال کے ساتھ رہنمائی۔',
      welcomeAuth: "NeuLife میں خوش آمدید",
    }
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
