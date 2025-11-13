import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Navigation
      signIn: "Sign In",
      signUp: "Sign Up",
      signOut: "Sign Out",
      getStarted: "Get Started",
      backToHome: "Back to Home",
      
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
      
      // Additional Features (not used on landing)
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
    }
  },
  hi: {
    translation: {
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
      
      signIn: "साइन इन करें",
      signUp: "साइन अप करें",
      signOut: "साइन आउट",
      getStarted: "शुरू करें",
      backToHome: "होम पर वापस जाएं",
      
      welcomeTitle: "आपकी स्वास्थ्य यात्रा, एक सुरक्षित कार्ड",
      welcomeSubtitle: "अपना अनूठा हेल्थ कार्ड आईडी प्राप्त करें और एआई-संचालित चिकित्सा ट्राइएज तक पहुंचें।",
      requestHealthCard: "हेल्थ कार्ड का अनुरोध करें",
      tryAITriage: "एआई ट्राइएज आज़माएं",
      
      uniqueHealthCard: "अनूठा हेल्थ कार्ड",
      uniqueHealthCardDesc: "HC-देश-तारीख-कोड प्रारूप के साथ अपना व्यक्तिगत हेल्थ कार्ड आईडी प्राप्त करें।",
      aiMedicalTriage: "एआई चिकित्सा ट्राइएज",
      aiMedicalTriageDesc: "मानव और पशु स्वास्थ्य के लिए साक्ष्य-आधारित ट्राइएज।",
      privacyConsent: "गोपनीयता और सहमति",
      privacyConsentDesc: "स्पष्ट सहमति प्रबंधन के साथ अपने डेटा पर पूर्ण नियंत्रण।",
      
      welcomeAuth: "न्यू केयर में आपका स्वागत है",
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
    }
  },
  ta: {
    translation: {
      signIn: "உள்நுழைக",
      signUp: "பதிவு செய்க",
      signOut: "வெளியேறு",
      getStarted: "தொடங்குங்கள்",
      backToHome: "முகப்புக்குத் திரும்பு",
      
      welcomeTitle: "உங்கள் சுகாதார பயணம், ஒரு பாதுகாப்பான அட்டை",
      welcomeSubtitle: "உங்கள் தனிப்பட்ட ஹெல்த் கார்டு ஐடியைப் பெறுங்கள் மற்றும் AI-இயங்கும் மருத்துவ ட்ரையேஜை அணுகுங்கள்.",
      requestHealthCard: "ஹெல்த் கார்டு கோரிக்கை",
      tryAITriage: "AI ட்ரையேஜை முயற்சிக்கவும்",
      
      welcomeAuth: "நியூ கேர்க்கு வரவேற்கிறோம்",
      signInAccess: "உங்கள் சுகாதார டாஷ்போர்டை அணுக உள்நுழைக",
      fullName: "முழு பெயர்",
      email: "மின்னஞ்சல்",
      password: "கடவுச்சொல்",
      creatingAccount: "கணக்கு உருவாக்கப்படுகிறது...",
      signingIn: "உள்நுழைகிறது...",
      createAccount: "கணக்கை உருவாக்கு",
      
      welcomeUser: "வரவேற்பு",
      yourHealthCard: "உங்கள் ஹெல்த் கார்டு",
      healthCardID: "ஹெல்த் கார்டு ஐடி",
      status: "நிலை",
      provisional: "தற்காலிக",
      verified: "சரிபார்க்கப்பட்டது",
      
      triageTitle: "சான்று அடிப்படையிலான சுகாதார வழிகாட்டுதலைப் பெறுங்கள்",
      describeSymptoms: "உங்கள் அறிகுறிகளை விவரிக்கவும்",
      human: "மனிதர்",
      animal: "விலங்கு",
      age: "வயது",
      male: "ஆண்",
      female: "பெண்",
      other: "மற்றவை",
    }
  },
  te: {
    translation: {
      signIn: "సైన్ ఇన్",
      signUp: "సైన్ అప్",
      signOut: "సైన్ అవుట్",
      getStarted: "ప్రారంభించండి",
      backToHome: "హోమ్‌కు తిరిగి వెళ్ళు",
      
      welcomeTitle: "మీ ఆరోగ్య ప్రయాణం, ఒక సురక్షిత కార్డు",
      welcomeSubtitle: "మీ ప్రత్యేక హెల్త్ కార్డ్ IDని పొందండి మరియు AI-ఆధారిత వైద్య ట్రయాజ్‌ను యాక్సెస్ చేయండి.",
      requestHealthCard: "హెల్త్ కార్డ్ అభ్యర్థన",
      tryAITriage: "AI ట్రయాజ్ ప్రయత్నించండి",
      
      welcomeAuth: "న్యూ కేర్‌కు స్వాగతం",
      signInAccess: "మీ ఆరోగ్య డాష్‌బోర్డ్‌ను యాక్సెస్ చేయడానికి సైన్ ఇన్ చేయండి",
      fullName: "పూర్తి పేరు",
      email: "ఇమెయిల్",
      password: "పాస్‌వర్డ్",
      creatingAccount: "ఖాతా సృష్టించబడుతోంది...",
      signingIn: "సైన్ ఇన్ అవుతోంది...",
      createAccount: "ఖాతా సృష్టించండి",
      
      welcomeUser: "స్వాగతం",
      yourHealthCard: "మీ హెల్త్ కార్డ్",
      healthCardID: "హెల్త్ కార్డ్ ID",
      status: "స్థితి",
      provisional: "తాత్కాలిక",
      verified: "ధృవీకరించబడింది",
      
      triageTitle: "సాక్ష్యం ఆధారిత ఆరోగ్య మార్గదర్శకత్వం పొందండి",
      describeSymptoms: "మీ లక్షణాలను వివరించండి",
      human: "మానవుడు",
      animal: "జంతువు",
      age: "వయస్సు",
      male: "పురుషుడు",
      female: "స్త్రీ",
      other: "ఇతర",
    }
  }
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
  });

export default i18n;