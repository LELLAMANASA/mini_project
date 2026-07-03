import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Square, 
  Languages, 
  Volume2, 
  X, 
  ArrowLeft, 
  Sparkles, 
  TrendingUp, 
  GraduationCap, 
  Briefcase, 
  Cpu, 
  Sprout, 
  Clock, 
  BookOpen,
} from 'lucide-react';
import { playClickSound } from '../utils/audio';

// Custom interfaces for localized articles in the 2070 Quantum Intelligence format
interface AetherLanguageContent {
  collapsed_thought: string;
  quantum_deepdive: string;
  audio_script: string;
  transliteration?: string;
}

interface NewsItem {
  id: string;
  category: string;
  time: string;
  source: string;
  readTime: string;
  link?: string;
  channel?: 'google' | 'microsoft';
  thought_matrix: {
    category: string;
    urgency_weight: string;
    animation_profile: {
      card_entrance: string;
      fullscreen_transition: string;
      audio_wave_frequency: 'low' | 'dynamic' | 'hyper';
    };
    english: AetherLanguageContent;
    hindi: AetherLanguageContent;
    telugu: AetherLanguageContent;
  };
}

const NEWS_DATA: NewsItem[] = [
  {
    id: 'news-1',
    category: 'Education',
    time: '10 mins ago',
    source: 'National Education Portal',
    readTime: '3 min read',
    thought_matrix: {
      category: 'EDUCATION',
      urgency_weight: '0.45',
      animation_profile: {
        card_entrance: 'fade-in-up-stagger',
        fullscreen_transition: 'morph-scale-fluid',
        audio_wave_frequency: 'low'
      },
      english: {
        collapsed_thought: 'National Digital Library Platform Logs 10 Million Active Students',
        quantum_deepdive: 'The Ministry of Education has announced that the newly upgraded digital curriculum resource platform has hit a milestone of ten million weekly active users. This system delivers high-throughput interactive modules, video lectures, and live practice assessments to remote areas without charging any licensing costs. A massive expansion is underway to include regional visual aid tools and adaptive cognitive paths computed using decentralized client intelligence.',
        audio_script: 'The Ministry of Education has announced that the newly upgraded digital curriculum resource platform has hit a milestone of ten million weekly active users. This system delivers high-throughput interactive modules, video lectures, and live practice assessments.'
      },
      hindi: {
        collapsed_thought: 'राष्ट्रीय डिजिटल पुस्तकालय मंच पर 10 मिलियन से अधिक छात्र सक्रिय हुए',
        transliteration: 'Shiksha mantralaya ne ghoshna ki hai ki haal hi mein unnat kiye gaye digital pathyakram sansadhan manch ne saptahik das million sakriya upyogkartao ka record banaya hai.',
        quantum_deepdive: 'शिक्षा मंत्रालय ने घोषणा की है कि हाल ही में उन्नत किए गए डिजिटल पाठ्यक्रम संसाधन मंच ने साप्ताहिक दस मिलियन सक्रिय उपयोगकर्ताओं का रिकॉर्ड बनाया है। यह प्रणाली सुदूर क्षेत्रों में बिना किसी लाइसेंस शुल्क के अत्यधिक इंटरैक्टिव मॉड्यूल, वीडियो व्याख्यान और लाइव अभ्यास मूल्यांकन प्रदान करती है। क्षेत्रीय स्तर पर दृश्य मूल्यांकन साधनों और अनुकूलित शिक्षा मार्गों को शामिल करने के लिए एक बड़ा विस्तार किया जा रहा है।',
        audio_script: 'Shiksha mantralaya ne ghoshna ki hai ki haal hi mein unnat kiye gaye digital pathyakram sansadhan manch ne saptahik das million sakriya upyogkartao ka record banaya hai.'
      },
      telugu: {
        collapsed_thought: 'జాతీయ డిజిటల్ లైబ్రరీ వేదికపై 10 మిలియన్ల మంది చురుకైన విద్యార్థులు',
        transliteration: 'Noothananga upgrade cheyabadina digital syllabus vanarula platform vaaraaniki koti mandi churukaina viniyogadaarula mailurayini cherukundani vidya mantrithva shakha prakatinchindi.',
        quantum_deepdive: 'నూతనంగా అప్‌గ్రేడ్ చేయబడిన డిజిటల్ సిలబస్ వనరుల ప్లాట్‌ఫారమ్ వారానికి కోటి మంది చురుకైన వినియోగదారుల మైలురాయిని చేరుకుందని విద్యా మంత్రిత్వ శాఖ ప్రకటించింది. ఈ వ్యవస్థ ఎటువంటి లైసెన్సింగ్ రుసుము లేకుండా మారుమూల ప్రాంతాలకు ఇంటరాక్టివ్ పాఠాలు, వీడియో ఉపన్యాసాలు మరియు ప్రత్యక్ష పరీక్షలను అందిస్తుంది.',
        audio_script: 'Noothananga upgrade cheyabadina digital syllabus vanarula platform vaaraaniki koti mandi churukaina viniyogadaarula mailurayini cherukundani vidya mantrithva shakha prakatinchindi.'
      }
    }
  },
  {
    id: 'news-2',
    category: 'Jobs',
    time: '25 mins ago',
    source: 'Career Catalyst Express',
    readTime: '4 min read',
    thought_matrix: {
      category: 'CAREERS',
      urgency_weight: '0.80',
      animation_profile: {
        card_entrance: 'fade-in-up-stagger',
        fullscreen_transition: 'morph-scale-fluid',
        audio_wave_frequency: 'dynamic'
      },
      english: {
        collapsed_thought: 'Global Tech Giants Announce Combined 50,000 Entry-Level Software Openings',
        quantum_deepdive: 'A coalition of global software leaders has pledged to roll out over fifty thousand entry-level associate engineer roles starting early next quarter. Focused heavily on modern full-stack web engineering, native application development, and foundational cloud infrastructure, these jobs prioritize hands-on project portfolios over rigid academic credentials. Application portals are set to open online next Monday.',
        audio_script: 'A coalition of global software leaders has pledged to roll out over fifty thousand entry-level associate engineer roles starting early next quarter. These jobs prioritize hands-on project portfolios over rigid academic credentials. Application portals are set to open online next Monday.'
      },
      hindi: {
        collapsed_thought: 'वैश्विक टेक दिग्गजों ने 50,000 से अधिक शुरुआती स्तर के सॉफ्टवेयर पदों की घोषणा की',
        transliteration: 'Vaishvik software netao ke ek gathbandhan ne agli तिमाही ki shuruaat mein pachaas hazar se adhik shuruaati star ke associate engineer bhumikao ko shuru karne ki pratibaddhata jatai hai.',
        quantum_deepdive: 'वैश्विक सॉफ्टवेयर नेताओं के एक गठबंधन ने अगली तिमाही की शुरुआत में पचास हजार से अधिक शुरुआती स्तर के एसोसिएट इंजीनियर भूमिकाओं को शुरू करने की प्रतिबद्धता जताई है। वेब इंजीनियरिंग, स्थानीय एप्लिकेशन विकास और क्लाउड इंफ्रास्ट्रक्चर पर केंद्रित ये नौकरियां कठोर शैक्षणिक क्रेडेंशियल्स पर व्यावहारिक प्रोजेक्ट पोर्टफोलियो को प्राथमिकता देती हैं। आवेदन पोर्टल अगले सोमवार को ऑनलाइन खोले जाएंगे।',
        audio_script: 'Vaishvik software netao ke ek gathbandhan ne agli तिमाही ki shuruaat mein pachaas hazar se adhik shuruaati star ke associate engineer bhumikao ko shuru karne ki pratibaddhata jatai hai.'
      },
      telugu: {
        collapsed_thought: 'ప్రముఖ గ్లోబల్ టెక్ సంస్థలలో 50,000 ప్రారంభ స్థాయి సాఫ్ట్‌వేర్ ఉద్యోగాలు',
        transliteration: 'Vacche thraimaasikam praarambham nundi yaabhai vela kante ekkuva praarambha sthayi associate engineer udyogaalanu vidudala cheyanunnatlu global software samsthala kootami prakatinchindi.',
        quantum_deepdive: 'వచ్చే త్రైమాసికం ప్రారంభం నుండి యాభై వేల కంటే ఎక్కువ ప్రారంభ స్థాయి అసోసియేట్ ఇంజనీర్ ఉద్యోగాలను విడుదల చేయనున్నట్లు గ్లోబల్ సాఫ్ట్‌వేర్ సంస్థల కూటమి ప్రకటించింది. ఆధునిక వెబ్ ఇంజినీరింగ్, నేటివ్ అప్లికేషన్ డెవలప్మెంట్ మరియు క్లౌడ్ ఇన్‌ఫ్రాస్ట్రక్చర్‌పై దృష్టి సారించిన ఈ ఉద్యోగాలలో అకడమిక్ డిగ్రీల కంటే ప్రాజెక్ట్ పోర్ట్‌ఫోలియోలకు ప్రాధాన్యత ఇస్తారు.',
        audio_script: 'Vacche thraimaasikam praarambham nundi yaabhai vela kante ekkuva praarambha sthayi associate engineer udyogaalanu vidudala cheyanunnatlu global software samsthala kootami prakatinchindi.'
      }
    }
  },
  {
    id: 'news-3',
    category: 'Job Notifications',
    time: '45 mins ago',
    source: 'Federal Recruiters Group',
    readTime: '2 min read',
    thought_matrix: {
      category: 'NOTIFICATIONS',
      urgency_weight: '0.90',
      animation_profile: {
        card_entrance: 'fade-in-up-stagger',
        fullscreen_transition: 'morph-scale-fluid',
        audio_wave_frequency: 'hyper'
      },
      english: {
        collapsed_thought: 'Syllabus Revision Guidelines Released for Next National Railway Recruitments',
        quantum_deepdive: 'The Railway Recruitment Board has officially finalized the revamped test framework and modular syllabus guidelines for upcoming recruitment drives. Notable upgrades include a dedicated computer aptitude assessment and dynamic real-time logical reasoning sections designed to measure multi-tasking and cognitive agility. Registrations begin entirely online next month.',
        audio_script: 'The Railway Recruitment Board has officially finalized the revamped test framework and modular syllabus guidelines for upcoming recruitment drives. Notable upgrades include a dedicated computer aptitude assessment and dynamic real-time logical reasoning sections.'
      },
      hindi: {
        collapsed_thought: 'अगली राष्ट्रीय रेलवे भर्ती के लिए नए पाठ्यक्रम दिशानिर्देश जारी',
        transliteration: 'Railway bharti board ne aadhikarik taur par aagami bharti abhiyano ke liye naye parikshan dhanche aur pathyakram dishanirdesho ko antim roop de diya hai.',
        quantum_deepdive: 'रेलवे भर्ती बोर्ड ने आधिकारिक तौर पर आगामी भर्ती अभियानों के लिए नए परीक्षण ढांचे और पाठ्यक्रम दिशानिर्देशों को अंतिम रूप दे दिया है। उल्लेखनीय बदलावों में कंप्यूटर योग्यता मूल्यांकन और तार्किक तर्क अनुभाग शामिल हैं जो तनाव में निर्णय लेने की क्षमता का परीक्षण करने के लिए डिज़ाइन किए गए हैं। पंजीकरण अगले महीने ऑनलाइन शुरू हो रहे हैं।',
        audio_script: 'Railway bharti board ne aadhikarik taur par aagami bharti abhiyano ke liye naye parikshan dhanche aur pathyakram dishanirdesho ko antim roop de diya hai.'
      },
      telugu: {
        collapsed_thought: 'తదుపరి జాతీయ రైల్వే రిక్రూట్‌మెంట్ల కోసం నూతన సిలబస్ మార్గదర్శకాలు విడుదల',
        transliteration: 'Railway recruitment board raaboye udyoga prachaaraala kosam savarinchina prashnala saraali mariyu anukoola syllabus maargadarsakaalanu aadhikaarikanga kharaaru chesindi.',
        quantum_deepdive: 'రైల్వే రిక్రూట్‌మెంట్ బోర్డ్ రాబోయే ఉద్యోగ ప్రచారాల కోసం సవరించిన ప్రశ్నల సరళి మరియు అనుకూల సిలబస్ మార్గదర్శకాలను అధికారికంగా ఖరారు చేసింది. కంప్యూటర్ ఆప్టిట్యూడ్ టెస్ట్ మరియు ప్రత్యక్ష లాజికల్ రీజనింగ్ విభాగాలను ప్రవేశపెట్టారు. దరఖాస్తుల నమోదు ప్రక్రియ వచ్చే నెలలో ఆన్‌లైన్ లో ప్రారంభమవుతుంది.',
        audio_script: 'Railway recruitment board raaboye udyoga prachaaraala kosam savarinchina prashnala saraali mariyu anukoola syllabus maargadarsakaalanu aadhikaarikanga kharaaru chesindi.'
      }
    }
  },
  {
    id: 'news-4',
    category: 'Government Job Notification',
    time: '1 hour ago',
    source: 'Civil Services Gazette',
    readTime: '5 min read',
    thought_matrix: {
      category: 'GOVERNMENT',
      urgency_weight: '0.92',
      animation_profile: {
        card_entrance: 'fade-in-up-stagger',
        fullscreen_transition: 'morph-scale-fluid',
        audio_wave_frequency: 'hyper'
      },
      english: {
        collapsed_thought: 'Official Notification Out for 15,000 Civil Services Administration Posts for 2026',
        quantum_deepdive: 'The Union Civil Services Commission has published the official notification inviting online registration for up to fifteen thousand central administrative posts. Candidates holding any valid, accredited undergraduate degree can submit online applications. This round streamlines testing into a dual computer adaptive format.',
        audio_script: 'The Union Civil Services Commission has published the official notification inviting online registration for up to fifteen thousand central administrative posts.'
      },
      hindi: {
        collapsed_thought: '2026 के लिए 15,000 सिविल सेवा प्रशासनिक पदों के लिए आधिकारिक अधिसूचना जारी',
        transliteration: 'Union Civil Services Commission ne aadhikarik taur par pandrah hazaar prashasanik padon ke liye aavedan aamantrit kiye hain.',
        quantum_deepdive: 'केंद्रीय सिविल सेवा आयोग ने पंद्रह हजार से अधिक प्रशासनिक पदों के लिए आधिकारिक अधिसूचना जारी कर दी है। सभी योग्य स्नातक अंतिम रूप से आवेदन कर सकते हैं। यह भर्ती प्रक्रिया इस वर्ष कंप्यूटर आधारित टेस्ट परीक्षा प्रणाली पर संचालित की जाएगी।',
        audio_script: 'Union Civil Services Commission ne aadhikarik taur par pandrah hazaar prashasanik padon ke liye aavedan aamantrit kiye hain.'
      },
      telugu: {
        collapsed_thought: '2026 సంవత్సరానికి గాను 15,000 సివిల్ సర్వీసెస్ అడ్మినిస్ట్రేషన్ ఉద్యోగాలకు అధికారిక నోటిఫికేషన్ విడుదల',
        transliteration: 'Union Civil Services Commission padhiheynu vela central administrative udyogaala kosam aadhikaarika notification vidudala chesindi.',
        quantum_deepdive: 'కేంద్ర సివిల్ సర్వీసెస్ కమిషన్ పదిహేను వేల కేంద్ర పరిపాలనా ఉద్యోగాల కోసం అధికారిక నోటిఫికేషన్‌ను విడుదల చేసింది. గుర్తింపు పొందిన డిగ్రీ ఉన్న అభ్యర్థులందరూ దరఖాస్తు చేసుకోవడానికి అర్హులు. ఈ రిక్రూట్‌మెంట్‌లో నూతన పరీక్ష విధానాన్ని అమలు చేయనున్నారు.',
        audio_script: 'Union Civil Services Commission padhiheynu vela central administrative udyogaala kosam aadhikaarika notification vidudala chesindi.'
      }
    }
  },
  {
    id: 'news-6',
    category: 'Farming',
    time: '3 hours ago',
    source: 'Agri-Tech Journal',
    readTime: '4 min read',
    thought_matrix: {
      category: 'FARMING',
      urgency_weight: '0.70',
      animation_profile: {
        card_entrance: 'fade-in-up-stagger',
        fullscreen_transition: 'morph-scale-fluid',
        audio_wave_frequency: 'low'
      },
      english: {
        collapsed_thought: 'Precision Drip Automation Drastically Conserves Ground Water in Semi-Arid Zones',
        quantum_deepdive: 'By linking real-time solar-powered telemetry sensors directly with micro-climate transpiration models, regional agricultural operations have recorded a thirty-five percent drop in water volumes. Rather than supplying water on automated flat timers, the system computes the crop moisture transpiration baseline, introducing localized moisture feeds precisely at critical soil thresholds. Soil organic integrity and yield consistency have stabilized dramatically.',
        audio_script: 'By linking real-time solar-powered telemetry sensors directly with micro-climate transpiration models, regional agricultural operations have recorded a thirty-five percent drop in water volumes.'
      },
      hindi: {
        collapsed_thought: 'सटीक ड्रिप सिंचाई स्वचालन ने अर्ध-शुष्क क्षेत्रों में भूजल की भारी बचत की',
        transliteration: 'Vastavik samay ke solar-powered telemetry sensor ko seedhe jalvayu vashpotsarjan modelo se jodkar, krishi pariyojanao mein kul paani ki khapat mein paitis pratishat ki kami darj kaayi gayi hai.',
        quantum_deepdive: 'वास्तविक समय के सौर-ऊर्जा संचालित टेलीमेट्री सेंसर को सीधे जलवायु वाष्पोत्सर्जन मॉडलों से जोड़कर, कृषि परियोजनाओं में कुल पानी की खपत में पैंतीस प्रतिशत की कमी दर्ज की गई है। पुराने टाइमर के बजाय, प्रणाली मिट्टी के महत्वपूर्ण स्तरों पर बहुत सटीक रूप से केवल आवश्यकता पड़ने पर ही पानी छोड़ती है। इससे उपज की गुणवत्ता बहुत बेहतर हुई है।',
        audio_script: 'Vastavik samay ke solar-powered telemetry sensor ko seedhe jalvayu vashpotsarjan modelo se jodkar, krishi pariyojanao mein kul paani ki khapat mein paitis pratishat ki kami darj kaayi gayi hai.'
      },
      telugu: {
        collapsed_thought: 'పరిసిషన్ డ్రిప్ ఆటోమేషన్ ద్వారా వర్షాభావ ప్రాంతాలలో భూగర్భ జలాల ఆదా',
        transliteration: 'Soura vidyuth-tho panichese telemetry sensor-lanu vaathaavarana maarpula namoonalatho anusandhanam cheyadam dvaara neeti viniyogaanni 35 shaatham varaku thagginchaaru.',
        quantum_deepdive: 'సౌర విద్యుత్‌తో పనిచేసే టెలిమెట్రీ సెన్సార్లను వాతావరణ మార్పుల నమూనాలతో అనుసంధానం చేయడం ద్వారా నీటి వినియోగాన్ని 35 శాతం వరకు తగ్గించినట్లు పరిశోధకులు తేల్చారు. ప్రతిరోజూ నిర్ణీత సమయాల్లో నీరు పెట్టే పద్ధతికి స్వస్తి పలికి, కేవలం మట్టిలో తేమ శాతం ఒక మేర తగ్గినప్పుడే ఈ సమయపాలన పరికరం నీటిని విడుదల చేస్తుంది. దీంతో సేంద్రీయ విలువలు మరియు పంట దిగుబడి పెరిగింది.',
        audio_script: 'Soura vidyuth-tho panichese telemetry sensor-lanu vaathaavarana maarpula namoonalatho anusandhanam cheyadam dvaara neeti viniyogaanni 35 shaatham varaku thagginchaaru.'
      }
    }
  },
  {
    id: 'news-7',
    category: 'Trending',
    time: '5 hours ago',
    source: 'Silicon Intelligence Reports',
    readTime: '3 min read',
    thought_matrix: {
      category: 'TRENDING',
      urgency_weight: '0.88',
      animation_profile: {
        card_entrance: 'fade-in-up-stagger',
        fullscreen_transition: 'morph-scale-fluid',
        audio_wave_frequency: 'dynamic'
      },
      english: {
        collapsed_thought: 'Meta-Learning Algorithms Redefining Personal Academic Mentorship Ecosystems',
        quantum_deepdive: 'A series of educational testing platforms are replacing standard linear tutoring workflows with next-generation continuous learning algorithms. Instead of simple question-and-answer tracking, these systems build mathematical cognitive maps of student memory retention capacity, delivering highly personalized flashcard reminders and micro-study challenges exactly when conceptual decay thresholds are approaching.',
        audio_script: 'A series of educational testing platforms are replacing standard linear tutoring workflows with next-generation continuous learning algorithms.'
      },
      hindi: {
        collapsed_thought: 'मेटा-लर्निंग एल्गोरिदम व्यक्तिगत शैक्षणिक मार्गदर्शन पारिस्थितिकी तंत्र को बदल रहे हैं',
        transliteration: 'Shaikshanik parikshan platformo ki ek shrinkhla paramparik linear tutoring workflow ko agli peedhi ke continuous learning algorithm se badal rahi hai.',
        quantum_deepdive: 'शैक्षणिक परीक्षण प्लेटफार्मों की एक श्रृंखला पारंपरिक रैखिक ट्यूशन वर्कफ़्लो को अगली पीढ़ी के कंटीन्यूअस लर्निंग एल्गोरिदम से बदल रही है। सरल प्रश्न-उत्तर ट्रैकिंग के बजाय, ये प्रणालियाँ छात्र की स्मृति अवधारणा क्षमता का गणितीय संज्ञानात्मक मानचित्र बनाती हैं, जिससे वैचारिक गिरावट का स्तर आते ही फ्लैशकार्ड अनुस्मारक दिए जाते हैं।',
        audio_script: 'Shaikshanik parikshan platformo ki ek shrinkhla paramparik linear tutoring workflow ko agli peedhi ke continuous learning algorithm se badal rahi hai.'
      },
      telugu: {
        collapsed_thought: 'మెటా-లర్నింగ్ అల్గారిథమ్స్ ద్వారా విద్యా విధానంలో విప్లవాత్మక మార్పులు',
        transliteration: 'Vidya samsthalalo bodhana vidhaananni saralatharam chesthoo krutrima medha-tho koodina Meta-learning algorithms prachuryam ponduthunnaayi.',
        quantum_deepdive: 'విద్యా సంస్థలలో బోధనా విధానాన్ని సరళతరం చేస్తూ కృత్రిమ మేధతో కూడిన మెటా-లర్నింగ్ అల్గారిథమ్స్ ప్రాచుర్యం పొందుతున్నాయి. విద్యార్థులు అడిగే సాధారణ సమాధానాల పరిమితిని దాటి, వారి జ్ఞాపకశక్తి మరియు ఆలోచనా శక్తి మెరుగుపడటానికి ఈ వ్యవస్థ అడాప్టివ్ పరీక్షలను ఇంకా ఫ్లాష్ కార్డ్ రిమైండర్లను అనువుగా అందిస్తుంది.',
        audio_script: 'Vidya samsthalalo bodhana vidhaananni saralatharam chesthoo krutrima medha-tho koodina Meta-learning algorithms prachuryam ponduthunnaayi.'
      }
    }
  }
];

export default function NewsAggregator() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedNews, setExpandedNews] = useState<NewsItem | null>(null);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  
  // Display limits and interactive scroll states
  const [displayLimit, setDisplayLimit] = useState<number>(6);
  const [googleLimit, setGoogleLimit] = useState<number>(5);
  const [microsoftLimit, setMicrosoftLimit] = useState<number>(5);
  const [breakingLimit, setBreakingLimit] = useState<number>(5);
  const [pullProgress, setPullProgress] = useState<number>(0);
  const [activeSignalIndex, setActiveSignalIndex] = useState<number>(0);

  // Slide connection and satellite lock simulation states
  const [isConnecting, setIsConnecting] = useState<boolean>(true);
  const [connectionProgress, setConnectionProgress] = useState<number>(0);
  const [connectionLogs, setConnectionLogs] = useState<string[]>([]);
  const [latencyMs, setLatencyMs] = useState<number>(35);
  const [downloadRate, setDownloadRate] = useState<string>("48.5 MB/s");

  // Article view options
  const [activeLang, setActiveLang] = useState<'english' | 'hindi' | 'telugu'>('english');
  const [isTransliterated, setIsTransliterated] = useState<boolean>(false);
  const [isTtsPlaying, setIsTtsPlaying] = useState<boolean>(false);
  const [ttsRate, setTtsRate] = useState<number>(1.0);

  // Audio wave decoration refs & dynamic state
  const [audioWaves, setAudioWaves] = useState<number[]>([12, 18, 30, 22, 14, 25, 45, 12, 19, 32, 22, 15, 29, 38, 12, 18]);
  const waveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const touchStartY = useRef<number>(0);

  const categories = [
    'All',
    'Education',
    'Jobs',
    'Job Notifications',
    'Government Job Notification',
    'Software',
    'Farming',
    'Trending'
  ];

  const fetchLiveNews = async (category: string) => {
    try {
      const response = await fetch(`/api/news?category=${encodeURIComponent(category)}`);
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setNewsList(data);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to fetch live news:", err);
      return false;
    }
  };

  // Simulated premium live connection stream handshake with actual fetch integrands
  const triggerReconnectDefault = (category: string = selectedCategory) => {
    setIsConnecting(true);
    setConnectionProgress(0);
    setPullProgress(0);
    setConnectionLogs(["[INIT] Handshaking secure Google News RSS receiver..."]);
    
    // Launch actual background synchronization
    const apiFetchPromise = fetchLiveNews(category);

    const logsSequence = [
      { prg: 25, log: "[CONNECT] Fetching live Google News RSS channels..." },
      { prg: 55, log: "[DECRYPT] Parsing real-time XML news structure..." },
      { prg: 80, log: "[COMPILE] Synthesizing multilingual translations and thought matrices..." }
    ];

    logsSequence.forEach((step, index) => {
      setTimeout(() => {
        setConnectionProgress(step.prg);
        setConnectionLogs(prev => [...prev, step.log]);
      }, (index + 1) * 300);
    });

    // Conclude step synchronization once API fetch or local fallback resolves
    setTimeout(async () => {
      const fetchSuccess = await apiFetchPromise;
      setConnectionProgress(100);
      setDisplayLimit(6); // Reset display view limit for a fresh animation entry
      if (fetchSuccess) {
        setConnectionLogs(prev => [
          ...prev, 
          "[SUCCESS] Live feed lock successful. Multilingual news feed fully updated!"
        ]);
      } else {
        setConnectionLogs(prev => [
          ...prev, 
          "[WARNING] RSS Feed offline. offline local premium fallback models loaded."
        ]);
        setNewsList([]); // Automatically uses client-side NEWS_DATA fallback
      }

      setTimeout(() => {
        setIsConnecting(false);
        setLatencyMs(Math.floor(Math.random() * 20) + 15);
        setDownloadRate((Math.random() * 15 + 40).toFixed(1) + " MB/s");
      }, 400);
    }, 1100);
  };

  useEffect(() => {
    triggerReconnectDefault(selectedCategory);
  }, [selectedCategory]);

  // Hook 1: Listen to scroll down for infinite loading
  useEffect(() => {
    const handleScroll = () => {
      const isNearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 250;
      if (isNearBottom && !isConnecting) {
        setDisplayLimit(prev => Math.min(prev + 3, filteredNews.length));
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [newsList, selectedCategory, isConnecting]);

  // Hook 2: Listen to wheel scroll-up at top to trigger reload/re-stream
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (window.scrollY <= 2 && e.deltaY < -12 && !isConnecting) {
        setPullProgress(prev => {
          const next = prev + 1;
          if (next >= 4) {
            triggerReconnectDefault(selectedCategory);
            return 0;
          }
          return next;
        });
      }
    };

    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [isConnecting, selectedCategory]);

  // Hook 3: Mobile Touch drag down to refresh
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (window.scrollY <= 2 && !isConnecting) {
        const currentY = e.touches[0].clientY;
        const diff = currentY - touchStartY.current;
        if (diff > 90) { // Dragged down more than 90px (mobile scroll up at top)
          triggerReconnectDefault(selectedCategory);
          touchStartY.current = currentY; // reset
        }
      }
    };
    
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isConnecting, selectedCategory]);

  // Speech helper to read aloud using window.speechSynthesis
  const speakArticle = (text: string, langCode: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    // Stop any ongoing speech
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      console.warn("speechSynthesis.cancel failed", e);
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure locale voices based on language selection
      if (langCode === 'hindi') {
        utterance.lang = 'hi-IN';
      } else if (langCode === 'telugu') {
        utterance.lang = 'te-IN';
      } else {
        utterance.lang = 'en-US';
      }

      utterance.rate = ttsRate;

      utterance.onend = () => {
        setIsTtsPlaying(false);
      };

      utterance.onerror = () => {
        setIsTtsPlaying(false);
      };

      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsTtsPlaying(true);
    } catch (err) {
      console.warn("speechSynthesis.speak failed", err);
      setIsTtsPlaying(false);
    }
  };

  const stopArticleSpeech = () => {
    try {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    } catch (e) {
      console.warn("speechSynthesis.cancel failed", e);
    }
    setIsTtsPlaying(false);
  };

  // Soundwave animation frame loop when playing
  useEffect(() => {
    if (isTtsPlaying) {
      waveTimerRef.current = setInterval(() => {
        setAudioWaves(prev => prev.map(() => Math.floor(Math.random() * 38) + 8));
      }, 100);
    } else {
      if (waveTimerRef.current) {
        clearInterval(waveTimerRef.current);
      }
      setAudioWaves([10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]);
    }

    return () => {
      if (waveTimerRef.current) {
        clearInterval(waveTimerRef.current);
      }
    };
  }, [isTtsPlaying]);

  // Handle changing text / language triggers TTS sync
  useEffect(() => {
    if (isTtsPlaying && expandedNews) {
      // Re-trigger speech instantly with new parameters
      const currentText = getArticleSpeechText();
      speakArticle(currentText, activeLang);
    }
  }, [activeLang, isTransliterated, ttsRate]);

  // Cleanup speech synthesis on Component unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Filtered News Items (Support both cached newsList and static NEWS_DATA gracefully)
  const filteredNews = (newsList.length > 0 ? newsList : (
    selectedCategory === 'All' 
      ? NEWS_DATA 
      : NEWS_DATA.filter(item => item.category === selectedCategory)
  )).map((item, index) => {
    if (!item.channel) {
      return {
        ...item,
        channel: index % 2 === 0 ? 'google' : 'microsoft'
      };
    }
    return item;
  });

  const googleNews = filteredNews.filter(item => item.channel === 'google');
  const microsoftNews = filteredNews.filter(item => item.channel === 'microsoft');
  const breakingNews = [...filteredNews].sort((a, b) => {
    const wA = parseFloat(a.thought_matrix?.urgency_weight || '0.5');
    const wB = parseFloat(b.thought_matrix?.urgency_weight || '0.5');
    return wB - wA;
  });

  // Automatic ticker cycling interval
  useEffect(() => {
    if (filteredNews.length === 0) return;
    const interval = setInterval(() => {
      setActiveSignalIndex(prev => (prev + 1) % filteredNews.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [filteredNews.length]);

  const getNewsTitle = (news: any) => {
    if (!news) return 'Untitled Intel Node';
    return (
      news.thought_matrix?.[activeLang]?.collapsed_thought ||
      news.thought_matrix?.english?.collapsed_thought ||
      news.languages?.[activeLang]?.title ||
      news.languages?.english?.title ||
      news.title ||
      news.collapsed_thought ||
      'Untitled News Signal'
    );
  };

  const getNewsCategory = (news: any) => {
    if (!news) return 'Education';
    const raw = news.category || news.thought_matrix?.category || 'Education';
    // Normalize casing for display tags so they look neat
    if (raw.toUpperCase() === 'EDUCATION') return 'Education';
    if (raw.toUpperCase() === 'CAREERS' || raw.toUpperCase() === 'JOBS') return 'Jobs';
    if (raw.toUpperCase() === 'NOTIFICATIONS' || raw.toUpperCase() === 'GOVERNMENT JOB NOTIFICATION') return 'Government Job Notification';
    if (raw.toUpperCase() === 'TECH' || raw.toUpperCase() === 'SOFTWARE') return 'Software';
    if (raw.toUpperCase() === 'AGRI_INTELLIGENCE' || raw.toUpperCase() === 'FARMING') return 'Farming';
    return raw;
  };

  const getNewsSource = (news: any) => {
    if (!news) return 'AetherNews Intel';
    return news.source || 'AetherNews Intel';
  };

  const getNewsTime = (news: any) => {
    if (!news) return '10 mins ago';
    return news.time || '10 mins ago';
  };

  const getNewsReadTime = (news: any) => {
    if (!news) return '3 min read';
    return news.readTime || '3 min read';
  };

  const getArticleBodyText = () => {
    if (!expandedNews) return '';
    const field = expandedNews.thought_matrix?.[activeLang];
    if (field) {
      if (isTransliterated && activeLang !== 'english' && field.transliteration) {
        return field.transliteration;
      }
      return field.quantum_deepdive || field.collapsed_thought || '';
    }
    const content = expandedNews.languages?.[activeLang];
    if (content) {
      if (isTransliterated && activeLang !== 'english' && content.transliteration) {
        return content.transliteration;
      }
      return content.body || '';
    }
    
    // Fallback block
    return (
      expandedNews.thought_matrix?.english?.quantum_deepdive ||
      expandedNews.languages?.english?.body ||
      expandedNews.body ||
      expandedNews.quantum_deepdive ||
      'No deepdive intelligence compiled for this node.'
    );
  };

  const getArticleSpeechText = () => {
    if (!expandedNews) return '';
    const field = expandedNews.thought_matrix?.[activeLang];
    if (field) {
      return field.audio_script || field.quantum_deepdive || field.collapsed_thought || '';
    }
    const content = expandedNews.languages?.[activeLang];
    if (content) {
      return content.body || '';
    }
    
    return (
      expandedNews.thought_matrix?.english?.audio_script ||
      expandedNews.languages?.english?.body ||
      expandedNews.body ||
      'No text audio script generated.'
    );
  };

  const getArticleTitleText = () => {
    return getNewsTitle(expandedNews);
  };

  const handleOpenNews = (news: NewsItem) => {
    playClickSound();
    setExpandedNews(news);
    setActiveLang('english');
    setIsTransliterated(false);
    setIsTtsPlaying(false);
  };

  const handleCloseNews = () => {
    playClickSound();
    stopArticleSpeech();
    setExpandedNews(null);
  };

  const toggleTtsPlayState = () => {
    playClickSound();
    if (isTtsPlaying) {
      stopArticleSpeech();
    } else {
      const currentText = getArticleSpeechText();
      speakArticle(currentText, activeLang);
    }
  };

  // Category Icon helper
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Education': 
        return <GraduationCap className="w-4 h-4 text-emerald-500" />;
      case 'Jobs': 
        return <Briefcase className="w-4 h-4 text-amber-500" />;
      case 'Job Notifications':
        return <Clock className="w-4 h-4 text-purple-500" />;
      case 'Government Job Notification':
        return <Sparkles className="w-4 h-4 text-indigo-500" />;
      case 'Software':
        return <Cpu className="w-4 h-4 text-cyan-500" />;
      case 'Farming':
        return <Sprout className="w-4 h-4 text-emerald-600" />;
      case 'Trending':
      default:
        return <TrendingUp className="w-4 h-4 text-rose-500" />;
    }
  };

  const getCategoryBadgeStyle = (category: string) => {
    switch (category) {
      case 'Education': return 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-500/10';
      case 'Jobs': return 'bg-amber-500/10 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-500/10';
      case 'Job Notifications': return 'bg-purple-500/10 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400 border border-purple-500/10';
      case 'Government Job Notification': return 'bg-indigo-505/10 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400 border border-indigo-500/10';
      case 'Software': return 'bg-cyan-500/10 text-cyan-600 dark:bg-cyan-950/30 dark:text-cyan-400 border border-cyan-500/10';
      case 'Farming': return 'bg-teal-500/10 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400 border border-teal-500/10';
      case 'Trending':
      default:
        return 'bg-rose-500/10 text-rose-600 dark:bg-rose-950/30 dark:text-rose-450 border border-rose-500/10';
    }
  };

  return (
    <div className="relative w-full min-h-[70vh] flex flex-col gap-6" id="news-portal-container">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white/40 dark:bg-slate-900/10 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
              Live Stream Signals
            </span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-500">
              <span className={`w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block ${isConnecting ? 'animate-ping' : 'animate-pulse'}`}></span>{' '}
              {isConnecting ? 'Establishing Connection...' : 'Verified Signal Lock'}
            </span>
          </div>
          <h1 className="text-3xl font-black font-display tracking-tight text-slate-800 dark:text-white">
            News Aggregation Signal Room
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real time multilingual updates. Experience seamless takeover transitions, full narration, and script transliterations of regional notifications.
          </p>
        </div>

        {/* Real-time Telemetry Control Panel with Reconnect Trigger */}
        <div className="flex items-center gap-3 self-start md:self-center shrink-0">
          <div className="text-right hidden sm:block font-mono">
            <p className="text-[10px] text-slate-400 leading-none">STREAM LATENCY</p>
            <p className="text-xs font-black text-indigo-600 dark:text-indigo-400 mt-1">{isConnecting ? "--" : `${latencyMs}ms`}</p>
          </div>
          <button
            onClick={() => { playClickSound(); triggerReconnectDefault(); }}
            disabled={isConnecting}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border cursor-pointer transition-all duration-200 flex items-center gap-2 ${
              isConnecting 
                ? 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 border-slate-200 dark:border-slate-800 cursor-not-allowed'
                : 'bg-indigo-600 border-indigo-700 hover:bg-indigo-500 text-white shadow-xs active:scale-97'
            }`}
            title="Force reconnect live satellite feeds"
          >
            <i className={`fa-solid fa-satellite-dish ${isConnecting ? 'animate-spin' : ''}`}></i>
            <span>{isConnecting ? 'Connecting...' : 'Sync Live Streams'}</span>
          </button>
        </div>
      </div>

      {/* Categories Filter Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 -mx-2 px-2 max-w-full no-scrollbar select-none" id="category-filter-strip">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              disabled={isConnecting}
              onClick={() => { playClickSound(); setSelectedCategory(cat); }}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all duration-150 ${
                isConnecting
                  ? 'opacity-50 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-405'
                  : isSelected 
                    ? 'bg-indigo-600 border-indigo-700 text-white shadow-md cursor-pointer' 
                    : 'bg-white/40 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800 text-slate-650 hover:bg-white dark:hover:bg-slate-800 cursor-pointer'
              }`}
            >
              <span className="flex items-center gap-1.5">
                {cat !== 'All' && getCategoryIcon(cat)}
                {cat}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main minimal cards feed OR High-Tech Handshake Telemetry view */}
      {isConnecting ? (
        <div className="p-6 md:p-8 rounded-[32px] bg-slate-900 border border-slate-850 text-slate-200 min-h-[380px] flex flex-col justify-between animate-fade-in shadow-2xl relative overflow-hidden">
          {/* Neon grid wire decor background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:24px_24px] opacity-25"></div>
          
          <div className="space-y-6 z-10">
            {/* Handshake Title Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                </span>
                <div>
                  <h3 className="text-xs font-black uppercase font-mono tracking-widest text-indigo-400">TELEMETRY LINK STATUS</h3>
                  <p className="text-lg font-black text-white mt-0.5">Buffering Live Streams...</p>
                </div>
              </div>
              <span className="text-2xl font-black font-mono text-indigo-400">{connectionProgress}%</span>
            </div>

            {/* Dynamic Console Telemetry Logs Buffer */}
            <div className="bg-black/40 border border-slate-800/80 p-4 rounded-2xl md:p-5 font-mono text-[11px] leading-relaxed text-indigo-300 space-y-2.5 max-h-[160px] overflow-y-auto no-scrollbar">
              {connectionLogs.map((logStr, idx) => {
                const isSuccess = logStr.includes("[SUCCESS]");
                const isError = logStr.includes("[ERR]");
                return (
                  <div key={idx} className="flex gap-2 items-start animate-fade-in">
                    <span className="text-slate-600 select-none">&gt;</span>
                    <p className={`whitespace-pre-wrap ${isSuccess ? 'text-emerald-400 font-extrabold' : isError ? 'text-rose-455' : 'text-indigo-200'}`}>
                      {logStr}
                    </p>
                  </div>
                );
              })}
              <div className="flex gap-2 items-center text-slate-400 animate-pulse text-[10px]">
                <span className="inline-block animate-spin"><i className="fa-solid fa-spinner"></i></span>
                <span>Resolving satellite transport protocols...</span>
              </div>
            </div>
          </div>

          {/* Progress Indicator Slider bar */}
          <div className="space-y-3 z-10 pt-4 border-t border-slate-805">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400">
              <div className="flex items-center gap-1.5">
                <span>Bandwidth locked: <strong>{downloadRate}</strong></span>
              </div>
              <span>Tunneling Secure Feed Nodes</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300 ease-out shadow-[0_0_12px_#6366f1]"
                style={{ width: `${connectionProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {/* High-Tech Scroll Up / Pull down / Click Sync panel */}
          <div 
            onClick={() => { playClickSound(); triggerReconnectDefault(); }}
            className="group relative w-full py-3 px-5 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/15 border border-indigo-500/20 hover:border-indigo-500/45 cursor-pointer transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-indigo-650 dark:text-indigo-400 select-none overflow-hidden"
          >
            {/* Glowing background decor */}
            <div className="absolute top-0 right-0 w-48 h-full bg-gradient-to-l from-indigo-500/10 to-transparent -z-10 animate-pulse"></div>
            
            <div className="flex items-center gap-3">
              <div className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </div>
              <div className="text-left font-mono text-[11px]">
                <span className="font-extrabold uppercase tracking-wider block text-indigo-800 dark:text-indigo-300">📡 Google News Live Signal Stream Active</span>
                <span className="text-[10px] text-slate-505 dark:text-slate-400">Mouse wheel up at top or drag down on mobile to reload.</span>
              </div>
            </div>

            <div className="flex items-center gap-2 font-black font-mono text-xs self-start sm:self-center">
              {pullProgress > 0 ? (
                <div className="flex items-center gap-1.5 animate-pulse text-indigo-500">
                  <i className="fa-solid fa-satellite animate-bounce"></i>
                  <span>Syncing RSS feeds: {pullProgress * 25}%</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                  <span>↑ Scroll Up / Click to Force-Reload Real-Time Feeds</span>
                  <i className="fa-solid fa-arrow-rotate-right group-hover:rotate-45 transition-transform duration-300"></i>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="news-headings-grid">
            
            {/* COLUMN 1: GOOGLE NEWS LIVE */}
            <div className="flex flex-col gap-4 bg-white/30 dark:bg-slate-900/10 p-5 rounded-[32px] border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md">
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/40 dark:border-slate-800/40">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <h3 className="text-sm font-black text-slate-850 dark:text-slate-100 font-display tracking-tight uppercase">Google News Live</h3>
                </div>
                <span className="px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest bg-emerald-500 text-white animate-pulse flex items-center gap-1 select-none">
                  <i className="fa-solid fa-tower-broadcast text-[8px]"></i>
                  <span>Breaking</span>
                </span>
              </div>
              
              {/* Cards List */}
              <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-1 no-scrollbar">
                {googleNews.slice(0, googleLimit).map((news) => (
                  <div 
                    key={news.id}
                    onClick={() => handleOpenNews(news)}
                    className="group relative p-5 rounded-2xl cursor-pointer bg-white/50 dark:bg-slate-900/20 border border-slate-200/60 dark:border-slate-800/80 hover:border-emerald-400 dark:hover:border-emerald-500/30 hover:bg-white dark:hover:bg-slate-900/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden active:scale-[0.99]"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-bl-full group-hover:scale-110 transition-transform duration-300 -z-10"></div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md font-mono ${getCategoryBadgeStyle(getNewsCategory(news))}`}>
                          {getNewsCategory(news)}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono tracking-tight flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 opacity-60" /> {getNewsTime(news)}
                        </span>
                      </div>
                      <h2 className="text-xs font-black text-slate-800 dark:text-slate-100 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition duration-150 line-clamp-3">
                        {getNewsTitle(news)}
                      </h2>
                    </div>
                    <div className="flex items-center justify-between text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400 pt-3 border-t border-slate-150/40 dark:border-slate-800/20 mt-3 select-none">
                      <span className="flex items-center gap-1 hover:underline">
                        <BookOpen className="w-3.5 h-3.5" /> Full Article
                      </span>
                      <span className="text-slate-400 font-normal font-mono">{getNewsReadTime(news)}</span>
                    </div>
                  </div>
                ))}
                {googleNews.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-8">No Google News articles loaded.</p>
                )}
              </div>

              {/* Load More Button inside the column */}
              {googleNews.length > googleLimit && (
                <button
                  onClick={() => { playClickSound(); setGoogleLimit(prev => Math.min(prev + 5, googleNews.length)); }}
                  className="w-full py-2.5 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900/50 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider transition-all"
                >
                  Load More News ({googleNews.length - googleLimit} left)
                </button>
              )}
            </div>

            {/* COLUMN 2: MICROSOFT NEWS LIVE */}
            <div className="flex flex-col gap-4 bg-white/30 dark:bg-slate-900/10 p-5 rounded-[32px] border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md">
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/40 dark:border-slate-800/40">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                  </span>
                  <h3 className="text-sm font-black text-slate-850 dark:text-slate-100 font-display tracking-tight uppercase">Microsoft News Live</h3>
                </div>
                <span className="px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest bg-cyan-500 text-white animate-pulse flex items-center gap-1 select-none">
                  <i className="fa-solid fa-satellite-dish text-[8px]"></i>
                  <span>Live Signal</span>
                </span>
              </div>
              
              {/* Cards List */}
              <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-1 no-scrollbar">
                {microsoftNews.slice(0, microsoftLimit).map((news) => (
                  <div 
                    key={news.id}
                    onClick={() => handleOpenNews(news)}
                    className="group relative p-5 rounded-2xl cursor-pointer bg-white/50 dark:bg-slate-900/20 border border-slate-200/60 dark:border-slate-800/80 hover:border-cyan-400 dark:hover:border-cyan-500/30 hover:bg-white dark:hover:bg-slate-900/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden active:scale-[0.99]"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-500/5 to-transparent rounded-bl-full group-hover:scale-110 transition-transform duration-300 -z-10"></div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md font-mono ${getCategoryBadgeStyle(getNewsCategory(news))}`}>
                          {getNewsCategory(news)}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono tracking-tight flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 opacity-60" /> {getNewsTime(news)}
                        </span>
                      </div>
                      <h2 className="text-xs font-black text-slate-800 dark:text-slate-100 leading-snug group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition duration-150 line-clamp-3">
                        {getNewsTitle(news)}
                      </h2>
                    </div>
                    <div className="flex items-center justify-between text-[9px] font-extrabold text-cyan-600 dark:text-cyan-400 pt-3 border-t border-slate-150/40 dark:border-slate-800/20 mt-3 select-none">
                      <span className="flex items-center gap-1 hover:underline">
                        <BookOpen className="w-3.5 h-3.5" /> Full Article
                      </span>
                      <span className="text-slate-400 font-normal font-mono">{getNewsReadTime(news)}</span>
                    </div>
                  </div>
                ))}
                {microsoftNews.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-8">No Microsoft News articles loaded.</p>
                )}
              </div>

              {/* Load More Button inside the column */}
              {microsoftNews.length > microsoftLimit && (
                <button
                  onClick={() => { playClickSound(); setMicrosoftLimit(prev => Math.min(prev + 5, microsoftNews.length)); }}
                  className="w-full py-2.5 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900/50 text-cyan-600 dark:text-cyan-400 text-[10px] font-bold uppercase tracking-wider transition-all"
                >
                  Load More News ({microsoftNews.length - microsoftLimit} left)
                </button>
              )}
            </div>

            {/* COLUMN 3: LIVE BREAKING ALERTS */}
            <div className="flex flex-col gap-4 bg-rose-500/5 dark:bg-rose-950/5 p-5 rounded-[32px] border border-rose-500/10 dark:border-rose-500/20 backdrop-blur-md">
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-rose-500/20 dark:border-rose-500/20">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                  </span>
                  <h3 className="text-sm font-black text-rose-700 dark:text-rose-450 font-display tracking-tight uppercase">Live Alerts</h3>
                </div>
                <span className="px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest bg-rose-600 text-white animate-pulse flex items-center gap-1 select-none">
                  <i className="fa-solid fa-bolt text-[8px]"></i>
                  <span>URGENT</span>
                </span>
              </div>
              
              {/* Cards List */}
              <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-1 no-scrollbar">
                {breakingNews.slice(0, breakingLimit).map((news) => (
                  <div 
                    key={news.id}
                    onClick={() => handleOpenNews(news)}
                    className="group relative p-5 rounded-2xl cursor-pointer bg-white/60 dark:bg-slate-900/35 border border-rose-500/10 dark:border-rose-500/20 hover:border-rose-400 hover:bg-white dark:hover:bg-slate-900/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden active:scale-[0.99]"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-rose-500/5 to-transparent rounded-bl-full group-hover:scale-110 transition-transform duration-300 -z-10"></div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md font-mono bg-rose-500/10 text-rose-600 border border-rose-500/10`}>
                          ALERT
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono tracking-tight flex items-center gap-1">
                          <i className="fa-solid fa-tower-broadcast text-[9px] text-rose-500 animate-pulse"></i>
                          <span>Urgency: {(parseFloat(news.thought_matrix?.urgency_weight || '0.5') * 100).toFixed(0)}%</span>
                        </span>
                      </div>
                      <h2 className="text-xs font-black text-slate-850 dark:text-slate-100 leading-snug group-hover:text-rose-600 dark:group-hover:text-rose-450 transition duration-150 line-clamp-3">
                        {getNewsTitle(news)}
                      </h2>
                    </div>
                    <div className="flex items-center justify-between text-[9px] font-extrabold text-rose-600 dark:text-rose-400 pt-3 border-t border-slate-150/40 dark:border-slate-800/20 mt-3 select-none">
                      <span className="flex items-center gap-1 hover:underline">
                        <BookOpen className="w-3.5 h-3.5" /> Full Takeover
                      </span>
                      <span className="text-slate-400 font-normal font-mono">{getNewsReadTime(news)}</span>
                    </div>
                  </div>
                ))}
                {breakingNews.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-8">No breaking signals detected.</p>
                )}
              </div>

              {/* Load More Button inside the column */}
              {breakingNews.length > breakingLimit && (
                <button
                  onClick={() => { playClickSound(); setBreakingLimit(prev => Math.min(prev + 5, breakingNews.length)); }}
                  className="w-full py-2.5 rounded-xl border border-dashed border-rose-300/30 dark:border-rose-900/30 hover:bg-rose-550/10 text-rose-600 dark:text-rose-450 text-[10px] font-bold uppercase tracking-wider transition-all"
                >
                  Load More Alerts ({breakingNews.length - breakingLimit} left)
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* FULL-SCREEN EXPANSION ARTICLE READER (Takes over full screen gracefully with smooth entry scale / backdrop-blur) */}
      {expandedNews && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/90 backdrop-blur-3xl flex justify-center items-center p-4 md:p-8 animate-fade-in"
          id="fullscreen-news-takeover-overlay"
        >
          <div 
            className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-[32px] md:rounded-[40px] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden dynamic-takeover animate-scale-up text-left relative"
            id="fullscreen-news-takeover-card"
          >
            {/* Top decorative gradient bar reflecting category branding */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-indigo-500/15 via-indigo-500/5 to-transparent pointer-events-none -z-10"></div>

            {/* Takeover Header */}
            <div className="px-6 py-5 md:px-8 border-b border-slate-200/50 dark:border-slate-800/60 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2.5">
                <button 
                  onClick={handleCloseNews}
                  className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-850 dark:hover:text-white transition cursor-pointer flex items-center justify-center"
                  title="Return to Main Dashboard"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md font-mono ${getCategoryBadgeStyle(getNewsCategory(expandedNews))}`}>
                      {getNewsCategory(expandedNews)}
                    </span>
                    <span className="text-[10px] text-slate-550 dark:text-slate-400 font-semibold">{getNewsSource(expandedNews)}</span>
                  </div>
                </div>
              </div>

              {/* Close Button UI */}
              <button 
                onClick={handleCloseNews}
                className="h-9 w-9 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-950/40 text-slate-500 dark:text-slate-350 transition flex items-center justify-center cursor-pointer active:scale-95 shadow-2xs"
                title="Close takeover view"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Main Article Content */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
              
              {/* Timing Metadata line */}
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-450 uppercase tracking-wider">
                <span>{getNewsTime(expandedNews)}</span>
                <span className="text-slate-300">•</span>
                <span>{getNewsReadTime(expandedNews)}</span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1 text-emerald-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Raw signal verified
                </span>
              </div>

              {/* News Headline Heading title */}
              <h2 className="text-xl md:text-3xl font-black text-slate-800 dark:text-white leading-tight font-display tracking-tight">
                {getArticleTitleText()}
              </h2>

              {/* Premium Functional Toolbar Segment inside article view */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/50 dark:border-slate-800/80 flex flex-col gap-4">
                
                {/* Visualizer and primary triggers toolbar row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  
                  {/* Article reader button and visualizer soundwave */}
                  <div className="flex items-center gap-3.5 bg-white dark:bg-slate-900 border border-slate-200/30 dark:border-slate-800/80 p-1.5 rounded-2xl shadow-2xs">
                    <button 
                      onClick={toggleTtsPlayState}
                      className={`h-11 px-6 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 transition active:scale-95 cursor-pointer border ${
                        isTtsPlaying 
                          ? 'bg-rose-500 hover:bg-rose-600 text-white border-rose-600' 
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-700'
                      }`}
                    >
                      {isTtsPlaying ? (
                        <>
                          <Square className="w-4 h-4 fill-current" />
                          <span>Stop Reader</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current" />
                          <span>Listen Aloud</span>
                        </>
                      )}
                    </button>

                    {/* Soundwave Animation component (Subtle animation when Play state is true) */}
                    <div className="flex items-end gap-0.5 px-3 h-8 self-center" title="Voice spectrum telemetry">
                      {audioWaves.map((h, i) => (
                        <span 
                          key={i} 
                          style={{ height: `${h}px` }} 
                          className={`w-0.5 rounded-full transition-all duration-100 ${
                            isTtsPlaying ? 'bg-indigo-500 dark:bg-indigo-400' : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                        ></span>
                      ))}
                    </div>
                  </div>

                  {/* Languages Selector switcher */}
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex items-center gap-1 px-2 py-1.5 text-[10px] font-black uppercase text-slate-450 dark:text-slate-400 font-mono">
                      <Languages className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Language:</span>
                    </div>
                    <div className="flex bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/60 p-1 rounded-xl shadow-3xs">
                      {(['english', 'hindi', 'telugu'] as const).map((lang) => {
                        const isActive = activeLang === lang;
                        return (
                          <button
                            key={lang}
                            onClick={() => { playClickSound(); setActiveLang(lang); }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all duration-100 cursor-pointer ${
                              isActive 
                                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400' 
                                : 'text-slate-500 hover:text-slate-800 dark:text-slate-450'
                            }`}
                          >
                            {lang === 'english' ? 'English' : lang === 'hindi' ? 'Hindi' : 'Telugu'}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Second row: Transliteration toggle & Speech rate speeds */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-200/50 dark:border-slate-800/40 pt-3">
                  
                  {/* Transliteration control */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { playClickSound(); setIsTransliterated(!isTransliterated); }}
                      disabled={activeLang === 'english'}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border cursor-pointer select-none transition-all duration-150 flex items-center gap-1.5 ${
                        activeLang === 'english' 
                          ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-400 bg-slate-100 dark:bg-slate-800/20' 
                          : isTransliterated 
                            ? 'bg-purple-600 hover:bg-purple-700 border-purple-700 text-white shadow-xs' 
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-650 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                      <span>Read in English Script</span>
                    </button>
                    {activeLang === 'english' && (
                      <span className="text-[9px] text-slate-400 italic">Transliteration is for Hindi/Telugu</span>
                    )}
                  </div>

                  {/* Speech playback customization speed */}
                  <div className="flex items-center justify-between sm:justify-start gap-4">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-450 font-mono">
                      <Volume2 className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Speed rate:</span>
                    </div>
                    <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/60 p-0.5 rounded-lg select-none">
                      {([0.8, 1.0, 1.2, 1.5] as const).map((r) => (
                        <button
                          key={r}
                          onClick={() => { playClickSound(); setTtsRate(r); }}
                          className={`w-8 h-6 flex items-center justify-center text-[10px] font-bold rounded cursor-pointer ${
                            ttsRate === r 
                              ? 'bg-slate-100 dark:bg-slate-850 font-black text-indigo-600 dark:text-indigo-400' 
                              : 'text-slate-450 hover:text-slate-700 dark:text-slate-400'
                          }`}
                        >
                          {r}x
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

              {/* Main Article Body text area with responsive rendering typography */}
              <div className="prose dark:prose-invert max-w-none text-slate-650 dark:text-slate-300">
                
                {isTransliterated && activeLang !== 'english' && (
                  <div className="p-3 mb-4 rounded-xl bg-purple-500/10 border border-purple-500/10 text-[10px] font-black uppercase text-purple-600 dark:text-purple-400 font-mono tracking-widest flex items-center gap-1.5 select-none animate-fade-in">
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                    Currently rendering latin english-script transliterated text
                  </div>
                )}

                <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap font-sans font-medium tracking-normal select-text animate-fade-in">
                  {getArticleBodyText()}
                </p>
              </div>

              {/* Continuous Syllabus Context Mapping Box */}
              <div className="p-5 rounded-2xl bg-indigo-50/30 dark:bg-slate-800/20 border border-indigo-150/20 dark:border-slate-800 space-y-3 shadow-3xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-950/40 rounded-lg text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs">
                    <i className="fa-solid fa-graduation-cap"></i>
                  </div>
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-850 dark:text-indigo-300">Syllabus Context Connection</h4>
                </div>
                <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  This notification is linked directly with your active coursework study schedules. Candidates are highly recommended to add study notes on regional notifications or save exam notifications inside the <strong>Calendar Grid</strong> page for personalized milestone countdown checklists.
                </p>
              </div>

            </div>

            {/* Bottom action bar */}
            <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200/50 dark:border-slate-800/60 flex items-center justify-between gap-4">
              <span className="text-[10px] font-medium text-slate-400">Want to save? Mark highlights and paste quotes inside your live task planners.</span>
              <div className="flex items-center gap-2">
                {expandedNews.link && (
                  <a 
                    href={expandedNews.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playClickSound()}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-black text-xs uppercase tracking-wider rounded-xl transition cursor-pointer select-none whitespace-nowrap inline-flex items-center gap-1.5 active:scale-97 border border-slate-200 dark:border-slate-800"
                  >
                    <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                    <span>Read Original Article</span>
                  </a>
                )}
                <button 
                  onClick={handleCloseNews}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition cursor-pointer select-none whitespace-nowrap active:scale-97 shadow-xs"
                >
                  Done Reading
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
