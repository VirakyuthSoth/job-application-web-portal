const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const mongoose = require('mongoose');
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');
const connectDB = require('./config/db');

const seedData = async () => {
  try {
    console.log('🔄 Connecting to MongoDB for seeding...');
    await connectDB();

    console.log('🧹 Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Job.deleteMany({}),
      Application.deleteMany({}),
    ]);

    console.log('👤 Creating demo users...');
    // Create Employers
    const employer1 = await User.create({
      name: 'Sarah Jenkins',
      email: 'employer@jobportal.com',
      password: 'password123',
      role: 'employer',
      phone: '+855 12 345 678',
      headline: 'Head of Talent Acquisition @ TechFlow Solutions',
      bio: 'Building world-class high-growth engineering teams across Southeast Asia and global remote hubs.',
      companyName: 'TechFlow Solutions',
      companyWebsite: 'https://techflow-solutions.example.com',
      companyLocation: 'Phnom Penh, Cambodia & Remote',
    });

    const employer2 = await User.create({
      name: 'David Chen',
      email: 'hr@cloudpeak.com',
      password: 'password123',
      role: 'employer',
      phone: '+855 77 888 999',
      headline: 'VP of Engineering @ CloudPeak Software',
      bio: 'Leading modern cloud infrastructure and SaaS product development.',
      companyName: 'CloudPeak Software',
      companyWebsite: 'https://cloudpeak.example.com',
      companyLocation: 'Singapore & Remote',
    });

    const employer3 = await User.create({
      name: 'Sophia Martinez',
      email: 'recruitment@nexustech.io',
      password: 'password123',
      role: 'employer',
      phone: '+1 512 555 0144',
      headline: 'Director of Global Recruitment @ NexusTech Innovations',
      bio: 'Connecting innovative developers, designers, and product leaders with visionary tech teams worldwide.',
      companyName: 'NexusTech Innovations',
      companyWebsite: 'https://nexustech.example.com',
      companyLocation: 'Austin, TX & Remote',
    });

    const employer4 = await User.create({
      name: 'Michael Thorne',
      email: 'careers@fintechprime.com',
      password: 'password123',
      role: 'employer',
      phone: '+44 20 7946 0912',
      headline: 'Head of People & Culture @ FinTech Prime',
      bio: 'Powering the future of secure digital finance and algorithmic banking solutions.',
      companyName: 'FinTech Prime',
      companyWebsite: 'https://fintechprime.example.com',
      companyLocation: 'London, UK & Hybrid',
    });

    // Create Job Seekers
    const seeker1 = await User.create({
      name: 'Virak Yuth',
      email: 'seeker@jobportal.com',
      password: 'password123',
      role: 'job_seeker',
      phone: '+855 96 111 222',
      headline: 'Full-Stack JavaScript / MERN Developer',
      bio: 'Passionate full-stack developer experienced in React, Node.js, Express, and MongoDB. Enthusiastic about creating fast, responsive, and scalable web applications.',
      skills: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'TypeScript', 'REST APIs', 'Git'],
      resumeUrl: 'https://drive.google.com/file/d/sample-virak-yuth-resume/view',
      portfolioUrl: 'https://github.com/virakyuth',
    });

    const seeker2 = await User.create({
      name: 'Alice Henderson',
      email: 'alice@jobportal.com',
      password: 'password123',
      role: 'job_seeker',
      phone: '+1 415 555 0192',
      headline: 'Product Designer & UI/UX Specialist',
      bio: 'Human-centered designer crafting beautiful, accessible, and intuitive user experiences for enterprise and consumer apps.',
      skills: ['Figma', 'UI/UX Design', 'Wireframing', 'Prototyping', 'Design Systems', 'CSS/Tailwind'],
      resumeUrl: 'https://drive.google.com/file/d/sample-alice-resume/view',
      portfolioUrl: 'https://dribbble.com/alicehenderson',
    });

    console.log('💼 Creating realistic job postings (20 diverse listings)...');
    const jobs = await Job.create([
      // 1. Senior Full-Stack Developer
      {
        title: 'Senior Full-Stack Developer (React & Node.js)',
        employer: employer1._id,
        companyName: 'TechFlow Solutions',
        location: 'Phnom Penh, Cambodia',
        workplaceType: 'Hybrid',
        jobType: 'Full-time',
        category: 'Software Development',
        experienceLevel: 'Senior Level',
        salaryMin: 2500,
        salaryMax: 4200,
        currency: 'USD',
        description:
          'We are seeking an experienced Senior Full-Stack Developer to lead frontend and backend architecture for our cloud-based collaboration platform. You will build high-impact microservices, design rich user experiences in React, and mentor junior engineers.',
        requirements: [
          '4+ years experience with React.js, modern JavaScript/TypeScript, and state management',
          '3+ years backend experience with Node.js and Express',
          'Proficiency with MongoDB / NoSQL data modeling and indexing',
          'Experience building and deploying RESTful APIs and microservices',
          'Strong understanding of clean architecture, testing, and CI/CD',
        ],
        responsibilities: [
          'Design, develop, and maintain performant full-stack features',
          'Collaborate with product managers and UI/UX designers to translate requirements into elegant code',
          'Write comprehensive unit and integration tests',
          'Participate in code reviews and architectural planning sessions',
        ],
        benefits: [
          'Competitive salary in USD with semi-annual performance reviews',
          'Flexible hybrid working schedule (2 days remote per week)',
          'Comprehensive health insurance including dental and vision',
          'Annual learning and conference allowance ($1,000/year)',
          'Modern MacBook Pro and ergonomic workspace equipment',
        ],
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'active',
      },

      // 2. Senior UI/UX & Product Designer
      {
        title: 'Senior UI/UX & Product Designer',
        employer: employer1._id,
        companyName: 'TechFlow Solutions',
        location: 'Remote (Southeast Asia)',
        workplaceType: 'Remote',
        jobType: 'Full-time',
        category: 'Design',
        experienceLevel: 'Senior Level',
        salaryMin: 1800,
        salaryMax: 3000,
        currency: 'USD',
        description:
          'We are looking for a creative and empathetic Senior UI/UX Designer to own our product design lifecycle. You will conduct user research, create interactive prototypes in Figma, and maintain our growing design system.',
        requirements: [
          '3+ years of professional digital product design experience',
          'Mastery of Figma, component libraries, and interactive prototyping',
          'Solid portfolio demonstrating UX research, user flows, and polished visuals',
          'Strong communication skills and ability to articulate design rationale',
        ],
        responsibilities: [
          'Lead end-to-end user research, wireframing, and high-fidelity mockups',
          'Maintain and evolve our universal Figma design system',
          'Partner with front-end engineers to ensure pixel-perfect implementation',
          'Conduct usability tests and iterate based on quantitative/qualitative user feedback',
        ],
        benefits: [
          '100% remote flexibility',
          'Annual team retreats to international destinations',
          'Home office setup stipend ($500)',
          'Paid time off: 22 days per year plus public holidays',
        ],
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        status: 'active',
      },

      // 3. DevOps & Cloud Infrastructure Engineer
      {
        title: 'DevOps & Cloud Infrastructure Engineer',
        employer: employer2._id,
        companyName: 'CloudPeak Software',
        location: 'Singapore / Remote',
        workplaceType: 'Remote',
        jobType: 'Full-time',
        category: 'Software Development',
        experienceLevel: 'Senior Level',
        salaryMin: 3200,
        salaryMax: 5000,
        currency: 'USD',
        description:
          'Join CloudPeak as our DevOps Engineer to build automated, secure, and resilient cloud infrastructure. You will manage Kubernetes clusters on AWS, automate CI/CD pipelines, and maintain 99.99% system availability.',
        requirements: [
          'Hands-on experience with AWS cloud services (ECS, EKS, RDS, S3, IAM)',
          'Deep knowledge of Docker and Kubernetes container orchestration',
          'Experience building CI/CD pipelines with GitHub Actions or GitLab CI',
          'Infrastructure as Code (Terraform or Pulumi)',
          'Familiarity with Prometheus, Grafana, and ELK stack observability',
        ],
        responsibilities: [
          'Automate deployment pipelines and cloud infrastructure provisioning',
          'Monitor application performance and ensure 24/7 uptime and disaster recovery',
          'Enforce strict security standards and access management protocols',
        ],
        benefits: [
          'Generous equity package and stock options',
          'Generous health & wellness stipend',
          'Global health insurance',
          'Unlimited paid time off policy',
        ],
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        status: 'active',
      },

      // 4. Junior Frontend Developer
      {
        title: 'Junior Frontend Developer (React & Tailwind)',
        employer: employer1._id,
        companyName: 'TechFlow Solutions',
        location: 'Phnom Penh, Cambodia',
        workplaceType: 'On-site',
        jobType: 'Full-time',
        category: 'Software Development',
        experienceLevel: 'Entry Level',
        salaryMin: 800,
        salaryMax: 1500,
        currency: 'USD',
        description:
          'Exciting opportunity for a passionate Junior Frontend Developer looking to kickstart their career in a supportive, high-growth environment. You will build dynamic web interfaces using React.js and modern CSS.',
        requirements: [
          'Proficiency with HTML5, CSS3, JavaScript (ES6+), and React.js',
          'Hands-on experience with Tailwind CSS or Bootstrap',
          'Understanding of REST APIs and Axios data fetching',
          'Familiarity with Git and version control',
          'Strong desire to learn and grow under experienced engineering mentorship',
        ],
        responsibilities: [
          'Develop reusable React UI components matching Figma mockups',
          'Integrate frontend components with RESTful backend endpoints',
          'Fix UI bugs and improve cross-browser responsiveness',
        ],
        benefits: [
          'Dedicated senior engineering mentor and weekly 1-on-1s',
          'Free lunch and snacks in office',
          'Clear progression path to Mid-Level Developer within 12-18 months',
          'Friendly, collaborative team culture',
        ],
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        status: 'active',
      },

      // 5. Digital Marketing & Growth Specialist
      {
        title: 'Digital Marketing & Growth Specialist',
        employer: employer2._id,
        companyName: 'CloudPeak Software',
        location: 'Remote',
        workplaceType: 'Remote',
        jobType: 'Full-time',
        category: 'Marketing',
        experienceLevel: 'Mid Level',
        salaryMin: 1400,
        salaryMax: 2400,
        currency: 'USD',
        description:
          'Lead growth marketing, paid acquisition, and SEO strategies for our B2B SaaS platform. You will manage ad campaigns, track conversion funnels, and optimize customer acquisition costs.',
        requirements: [
          '2+ years experience in digital marketing or B2B SaaS growth',
          'Proficiency with Google Ads, LinkedIn Ads, and Meta Business Suite',
          'Experience with Google Analytics 4, Mixpanel, or similar analytics tools',
          'Strong copywriting and content creation skills',
        ],
        responsibilities: [
          'Plan and execute multi-channel advertising campaigns',
          'Conduct A/B testing on landing pages and email workflows',
          'Generate weekly performance reports on CAC, LTV, and conversion rates',
        ],
        benefits: [
          'Performance bonuses based on growth targets',
          'Flexible working hours across timezones',
          'Marketing conference & course sponsorship',
        ],
        deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        status: 'active',
      },

      // 6. Data Analyst & BI Specialist
      {
        title: 'Data Analyst & Business Intelligence Specialist',
        employer: employer1._id,
        companyName: 'TechFlow Solutions',
        location: 'Phnom Penh, Cambodia',
        workplaceType: 'Hybrid',
        jobType: 'Full-time',
        category: 'Data & Analytics',
        experienceLevel: 'Mid Level',
        salaryMin: 1500,
        salaryMax: 2600,
        currency: 'USD',
        description:
          'Transform raw data into actionable business insights. You will build interactive dashboards in PowerBI/Tableau, write complex SQL queries, and collaborate with department heads.',
        requirements: [
          'Strong proficiency in SQL, Python or R for data analysis',
          'Experience building executive dashboards in PowerBI, Tableau, or Looker',
          'Solid understanding of statistical analysis and database schemas',
        ],
        responsibilities: [
          'Extract, clean, and model complex datasets from multiple data sources',
          'Build automated reporting dashboards for product and sales leadership',
          'Identify key trends and user behavior patterns to guide decision-making',
        ],
        benefits: [
          'Hybrid work flexibility',
          'Annual health checkup and insurance',
          'Continuous training in machine learning and advanced analytics',
        ],
        deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
        status: 'active',
      },

      // 7. Mobile App Developer (React Native & Flutter)
      {
        title: 'Mobile App Developer (React Native & Flutter)',
        employer: employer1._id,
        companyName: 'TechFlow Solutions',
        location: 'Phnom Penh, Cambodia',
        workplaceType: 'Hybrid',
        jobType: 'Full-time',
        category: 'Software Development',
        experienceLevel: 'Mid Level',
        salaryMin: 1800,
        salaryMax: 3200,
        currency: 'USD',
        description:
          'Join our mobile engineering squad to build cutting-edge iOS and Android applications. You will architect cross-platform mobile apps using React Native and Flutter, ensuring smooth animations, offline capabilities, and native integrations.',
        requirements: [
          '2+ years of hands-on experience building mobile applications with React Native or Flutter',
          'Deep understanding of state management (Redux Toolkit, Zustand, or Riverpod)',
          'Experience publishing apps to Google Play Store and Apple App Store',
          'Familiarity with native device APIs, push notifications, and background tasks',
          'Strong debugging and profiling skills on mobile devices',
        ],
        responsibilities: [
          'Design and build high-performance mobile features for iOS and Android',
          'Integrate backend REST APIs and WebSocket endpoints',
          'Ensure exceptional UI responsiveness across various screen sizes',
          'Maintain automated build pipelines on Fastlane and Expo EAS',
        ],
        benefits: [
          'Hybrid work arrangement with flexible hours',
          'Annual equipment allowance for testing devices and phones',
          'Premium health insurance and gym membership',
          'Year-end performance bonus',
        ],
        deadline: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000),
        status: 'active',
      },

      // 8. AI & Machine Learning Engineer
      {
        title: 'AI & Machine Learning Engineer (Python & PyTorch)',
        employer: employer2._id,
        companyName: 'CloudPeak Software',
        location: 'Singapore / Remote',
        workplaceType: 'Remote',
        jobType: 'Full-time',
        category: 'Software Development',
        experienceLevel: 'Senior Level',
        salaryMin: 4000,
        salaryMax: 6500,
        currency: 'USD',
        description:
          'CloudPeak is pioneering automated enterprise workflows through intelligent LLM orchestration and deep learning models. We are looking for an AI/ML Engineer to train, fine-tune, and deploy predictive models into high-concurrency production systems.',
        requirements: [
          'Strong background in Python, NumPy, Pandas, Scikit-learn, and PyTorch or TensorFlow',
          'Experience with Large Language Models (LLMs), RAG architectures, and vector databases (Pinecone, ChromaDB, pgvector)',
          'Hands-on experience deploying ML models with FastAPI, Docker, and Triton Inference Server',
          'Bachelor’s or Master’s degree in Computer Science, Data Science, or related field',
        ],
        responsibilities: [
          'Design and implement retrieval-augmented generation (RAG) pipelines',
          'Fine-tune open-weight models for specialized enterprise use cases',
          'Benchmark inference latency and optimize GPU memory utilization',
          'Collaborate with backend teams to integrate AI models seamlessly into web applications',
        ],
        benefits: [
          'Access to high-end cloud GPU clusters (H100 / A100)',
          'Top-tier remote compensation with company equity options',
          'Conference pass to NeurIPS, ICML, or CVPR',
          'Fully remote work with home office equipment stipend',
        ],
        deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        status: 'active',
      },

      // 9. Senior Product Manager
      {
        title: 'Senior Product Manager (SaaS & Enterprise)',
        employer: employer3._id,
        companyName: 'NexusTech Innovations',
        location: 'Austin, TX / Remote',
        workplaceType: 'Remote',
        jobType: 'Full-time',
        category: 'Software Development',
        experienceLevel: 'Lead / Manager',
        salaryMin: 3500,
        salaryMax: 5500,
        currency: 'USD',
        description:
          'Drive product vision, strategy, and execution for NexusTech’s core B2B SaaS platform. You will lead cross-functional squads of engineers and designers to discover customer pain points and ship market-leading features that drive ARR growth.',
        requirements: [
          '4+ years of product management experience within B2B SaaS or cloud technology',
          'Demonstrated track record of taking complex features from concept to release',
          'Strong analytical chops: comfortable defining KPIs, querying SQL, and analyzing funnel metrics',
          'Exceptional stakeholder management and customer-interviewing skills',
        ],
        responsibilities: [
          'Define the multi-quarter product roadmap in partnership with executive leadership',
          'Lead sprint planning, story mapping, and feature requirement documents (PRDs)',
          'Conduct weekly user interviews and translate feedback into actionable backlog items',
          'Collaborate with marketing and sales for impactful product launch campaigns',
        ],
        benefits: [
          'Competitive US-standard remote compensation',
          'Annual company summits in world-class destinations',
          'Comprehensive family healthcare coverage',
          'Unlimited paid time off policy',
        ],
        deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        status: 'active',
      },

      // 10. QA Automation & Test Engineer
      {
        title: 'QA Automation & Test Engineer (Cypress / Playwright)',
        employer: employer1._id,
        companyName: 'TechFlow Solutions',
        location: 'Phnom Penh, Cambodia',
        workplaceType: 'On-site',
        jobType: 'Full-time',
        category: 'Software Development',
        experienceLevel: 'Mid Level',
        salaryMin: 1200,
        salaryMax: 2200,
        currency: 'USD',
        description:
          'Ensure exceptional software quality across all TechFlow web and mobile platforms. You will establish end-to-end automation test suites, execute API testing, and work closely with developers to identify edge cases and regressions.',
        requirements: [
          '2+ years in software quality assurance with a focus on automated testing',
          'Strong proficiency in JavaScript/TypeScript test frameworks (Playwright, Cypress, or Selenium)',
          'Experience testing RESTful APIs using Postman, Newman, or Supertest',
          'Understanding of CI/CD pipeline integration with automated test runs',
          'Sharp eye for detail and bug reproduction methodology',
        ],
        responsibilities: [
          'Write and maintain automated regression and end-to-end test suites',
          'Perform manual exploratory testing for major milestone releases',
          'File clear, reproducible bug tickets with step-by-step logs and screenshots',
          'Promote test-driven development (TDD) best practices within engineering squads',
        ],
        benefits: [
          'Modern office in central Phnom Penh with gaming lounge',
          'Full health and accident insurance',
          'Annual salary increment and performance bonuses',
          'Continuous certification sponsorships (ISTQB, AWS)',
        ],
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        status: 'active',
      },

      // 11. Cybersecurity & Security Operations Analyst
      {
        title: 'Cybersecurity & Security Operations Analyst',
        employer: employer4._id,
        companyName: 'FinTech Prime',
        location: 'London, UK / Hybrid',
        workplaceType: 'Hybrid',
        jobType: 'Full-time',
        category: 'Software Development',
        experienceLevel: 'Senior Level',
        salaryMin: 3800,
        salaryMax: 5800,
        currency: 'USD',
        description:
          'Safeguard mission-critical banking and fintech infrastructure. You will manage vulnerability assessments, monitor SIEM security alerts, enforce SOC2 compliance, and respond to potential threats across cloud and network perimeters.',
        requirements: [
          '3+ years experience in cybersecurity, SOC analysis, or application security',
          'Familiarity with cloud security architectures on AWS or Azure',
          'Experience with SIEM tools (Splunk, Elastic Security, Datadog Security)',
          'Understanding of OWASP Top 10 web application vulnerabilities and remediation',
          'Certifications such as CISSP, CEH, CompTIA Security+, or AWS Security Specialty preferred',
        ],
        responsibilities: [
          'Monitor security event logs and coordinate rapid incident response procedures',
          'Perform periodic static and dynamic application security testing (SAST/DAST)',
          'Conduct internal phishing simulations and employee security awareness trainings',
          'Ensure continuous compliance with regulatory standards (ISO 27001, SOC2, GDPR)',
        ],
        benefits: [
          'Lucrative financial sector bonus structure',
          'Hybrid schedule (2 days London office, 3 days remote)',
          'Generous pension matching scheme up to 8%',
          'Private medical and dental care',
        ],
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        status: 'active',
      },

      // 12. Brand & Visual Graphic Designer
      {
        title: 'Brand & Visual Graphic Designer',
        employer: employer3._id,
        companyName: 'NexusTech Innovations',
        location: 'Remote (Worldwide)',
        workplaceType: 'Remote',
        jobType: 'Contract',
        category: 'Design',
        experienceLevel: 'Mid Level',
        salaryMin: 1500,
        salaryMax: 2500,
        currency: 'USD',
        description:
          'Create striking visual identities, social media campaigns, marketing illustrations, and presentation decks that elevate NexusTech’s global brand presence. We are looking for an inventive visual artist with a distinctive design sensibility.',
        requirements: [
          '2+ years experience in brand design, visual identity, or digital marketing graphics',
          'Mastery of Adobe Creative Suite (Illustrator, Photoshop, InDesign) and Figma',
          'Strong grasp of typography, layout balance, color psychology, and branding guidelines',
          'A compelling portfolio highlighting creative identity projects',
        ],
        responsibilities: [
          'Design graphics for product launches, marketing emails, and social media channels',
          'Create high-impact pitch decks and collateral for enterprise sales presentations',
          'Collaborate with UI/UX designers to maintain brand consistency across product surfaces',
        ],
        benefits: [
          'Flexible 6-month contract with strong potential for permanent full-time conversion',
          'Creative autonomy on brand campaigns',
          'Subscription to Adobe Creative Cloud and asset libraries provided',
        ],
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'active',
      },

      // 13. UI/UX Design Intern
      {
        title: 'UI/UX Design Intern',
        employer: employer1._id,
        companyName: 'TechFlow Solutions',
        location: 'Phnom Penh, Cambodia',
        workplaceType: 'On-site',
        jobType: 'Internship',
        category: 'Design',
        experienceLevel: 'Entry Level',
        salaryMin: 400,
        salaryMax: 700,
        currency: 'USD',
        description:
          'Are you a student or fresh graduate enthusiastic about user interface and user experience design? Join TechFlow’s design team for an intensive 3-month paid internship with dedicated 1-on-1 mentorship from senior designers.',
        requirements: [
          'Educational background in Design, Computer Science, Human-Computer Interaction, or self-taught portfolio',
          'Familiarity with Figma tools, wireframes, and basic prototyping',
          'Eagerness to learn modern design systems and receive constructive design critiques',
          'Good visual communication and teamwork mindset',
        ],
        responsibilities: [
          'Assist senior designers in creating component variants and UI icon sets',
          'Participate in design critiques and user research interviews',
          'Help audit app accessibility and contrast compliance',
        ],
        benefits: [
          'Paid internship with direct conversion opportunity to Junior UI/UX Designer',
          'Hands-on experience on live products with real active users',
          'Certificate of completion and professional letter of recommendation',
          'Free lunches and office team events',
        ],
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        status: 'active',
      },

      // 14. Content Marketing Strategist
      {
        title: 'Content Marketing Strategist & Copywriter',
        employer: employer2._id,
        companyName: 'CloudPeak Software',
        location: 'Remote',
        workplaceType: 'Remote',
        jobType: 'Part-time',
        category: 'Marketing',
        experienceLevel: 'Mid Level',
        salaryMin: 1000,
        salaryMax: 1800,
        currency: 'USD',
        description:
          'Craft engaging thought-leadership articles, case studies, product update newsletters, and SEO-optimized blog posts for CloudPeak. You will turn complex cloud engineering topics into accessible, reader-friendly content that captivates developers.',
        requirements: [
          'Native or bilingual English writing and editing skills',
          'Demonstrated portfolio of technical blogs, SaaS articles, or technology whitepapers',
          'Understanding of on-page SEO best practices and keyword placement',
          'Ability to interview software engineers and distill technical nuances into compelling narratives',
        ],
        responsibilities: [
          'Produce 2-3 in-depth technical blog posts and case studies weekly',
          'Manage the monthly developer newsletter and social post copy',
          'Optimize historical content to boost organic search rankings',
        ],
        benefits: [
          'Flexible part-time schedule (approx. 20 hours/week)',
          'Competitive hourly/monthly USD compensation',
          'Work alongside seasoned tech founders and cloud leaders',
        ],
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        status: 'active',
      },

      // 15. Enterprise Account Executive (B2B SaaS)
      {
        title: 'Enterprise Account Executive (B2B SaaS)',
        employer: employer2._id,
        companyName: 'CloudPeak Software',
        location: 'Singapore / Remote',
        workplaceType: 'Remote',
        jobType: 'Full-time',
        category: 'Sales',
        experienceLevel: 'Senior Level',
        salaryMin: 2500,
        salaryMax: 4500,
        currency: 'USD',
        description:
          'Drive net-new enterprise revenue by closing mid-market and enterprise deals for CloudPeak’s cloud platform. You will build relationships with CTOs, VPs of Engineering, and procurement leads across the Asia-Pacific and international markets.',
        requirements: [
          '3+ years of quota-carrying B2B SaaS software sales experience',
          'Proven record of meeting or exceeding annual sales targets ($500k+ ARR)',
          'Experience running consultative sales cycles and complex contract negotiations',
          'Proficiency with CRM tools like HubSpot or Salesforce',
        ],
        responsibilities: [
          'Manage end-to-end sales cycle from demo to contract signature',
          'Deliver persuasive technical product demonstrations in coordination with Sales Engineers',
          'Maintain clean pipeline forecasting and accurate deal stage records',
        ],
        benefits: [
          'Uncapped commission structure with accelerators for over-performance (OTE $80,000+)',
          'Travel budget for regional client visits and tech expos',
          'Comprehensive health insurance and wellness stipend',
        ],
        deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        status: 'active',
      },

      // 16. Sales Development Representative (SDR)
      {
        title: 'Sales Development Representative (SDR)',
        employer: employer3._id,
        companyName: 'NexusTech Innovations',
        location: 'Remote',
        workplaceType: 'Remote',
        jobType: 'Full-time',
        category: 'Sales',
        experienceLevel: 'Entry Level',
        salaryMin: 900,
        salaryMax: 1600,
        currency: 'USD',
        description:
          'Kickstart your high-reward career in technology sales! As an SDR at NexusTech, you will generate new qualified pipeline opportunities through targeted outbound email outreach, LinkedIn networking, and cold prospect calls.',
        requirements: [
          'Excellent verbal and written English communication skills',
          'High energy, resilience, and an enthusiastic learning mindset',
          'Comfortable conducting outbound outreach and speaking with decision-makers',
          'Previous sales, retail, or customer-facing experience is a strong plus',
        ],
        responsibilities: [
          'Conduct multi-channel outbound prospecting campaigns to target accounts',
          'Qualify inbound leads and schedule product discovery calls for Account Executives',
          'Achieve monthly quotas of qualified demo meetings booked',
        ],
        benefits: [
          'Monthly performance incentives and uncapped bonus bonuses',
          'Clear promotion track to Account Executive or Customer Success within 12 months',
          'Comprehensive sales training boot camp and daily coaching',
        ],
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        status: 'active',
      },

      // 17. Customer Success & Support Specialist
      {
        title: 'Customer Success & Support Specialist',
        employer: employer1._id,
        companyName: 'TechFlow Solutions',
        location: 'Phnom Penh, Cambodia',
        workplaceType: 'Hybrid',
        jobType: 'Full-time',
        category: 'Customer Support',
        experienceLevel: 'Entry Level',
        salaryMin: 700,
        salaryMax: 1200,
        currency: 'USD',
        description:
          'Be the empathetic voice of TechFlow for our growing customer base. You will assist users via live chat, email, and tickets, troubleshoot software questions, and guide users through onboarding workflows.',
        requirements: [
          'Strong interpersonal empathy and problem-solving patience',
          'Fluency in English (written and spoken); Khmer fluency is an advantage',
          'Familiarity with helpdesk tools (Zendesk, Intercom, or Freshdesk) is beneficial',
          'Ability to communicate technical solutions in simple, friendly terms',
        ],
        responsibilities: [
          'Respond quickly and thoughtfully to incoming user support inquiries',
          'Author helpful articles for our public Knowledge Base and FAQ docs',
          'Collaborate with developers to escalate recurring software bugs',
        ],
        benefits: [
          'Friendly office environment with hybrid flexibility',
          'Health insurance coverage and annual dental checkups',
          'Fast-track career development into Tier 2 Support or Account Management',
        ],
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        status: 'active',
      },

      // 18. Technical Support Engineer (Tier 2)
      {
        title: 'Technical Support Engineer (Tier 2 Cloud)',
        employer: employer2._id,
        companyName: 'CloudPeak Software',
        location: 'Remote (Asia-Pacific)',
        workplaceType: 'Remote',
        jobType: 'Full-time',
        category: 'Customer Support',
        experienceLevel: 'Mid Level',
        salaryMin: 1300,
        salaryMax: 2200,
        currency: 'USD',
        description:
          'Diagnose and solve complex technical challenges for CloudPeak enterprise clients. You will investigate API logs, reproduce database anomalies, inspect HTTP request payloads, and collaborate with core developers on hotfixes.',
        requirements: [
          '2+ years experience in technical application support or sysadmin troubleshooting',
          'Hands-on experience reading server logs, JSON payloads, and REST API responses',
          'Basic scripting skills (Bash, Python, or JavaScript) and SQL querying',
          'Strong sense of ownership and calm demeanor under priority escalation incidents',
        ],
        responsibilities: [
          'Investigate complex Tier 2 support tickets escalated by frontline agents',
          'Write clear technical issue tickets for engineering with full reproduction steps',
          'Assist clients during critical production downtime incidents',
        ],
        benefits: [
          '100% remote job with flexible shift scheduling',
          'Home internet and workstation stipend',
          'Generous paid annual leave and holiday bonuses',
        ],
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'active',
      },

      // 19. Financial Analyst & Corporate Accountant
      {
        title: 'Financial Analyst & Corporate Accountant',
        employer: employer4._id,
        companyName: 'FinTech Prime',
        location: 'London, UK / Hybrid',
        workplaceType: 'Hybrid',
        jobType: 'Full-time',
        category: 'Finance',
        experienceLevel: 'Mid Level',
        salaryMin: 2800,
        salaryMax: 4200,
        currency: 'USD',
        description:
          'Support corporate financial planning, cash flow forecasting, budgeting, and financial reporting at FinTech Prime. You will work closely with the CFO and executive team to build financial models that inform strategic investments.',
        requirements: [
          '2+ years in financial analysis, corporate accounting, or audit (Big 4 experience is a plus)',
          'Advanced Excel financial modeling skills (VBA, PowerQuery, dynamic formulas)',
          'Degree in Finance, Accounting, Economics, or progress toward ACCA / CFA / CPA',
          'High integrity and strong analytical precision with financial figures',
        ],
        responsibilities: [
          'Prepare monthly and quarterly financial management statements',
          'Analyze revenue trends, departmental expense variances, and runway metrics',
          'Assist in preparing board presentations and annual investor reports',
        ],
        benefits: [
          'Financial sponsorship for professional accounting certifications (ACCA/CFA)',
          'Competitive London financial sector base salary plus annual bonus',
          'Generous pension plan and private healthcare',
        ],
        deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        status: 'active',
      },

      // 20. Talent Acquisition & HR Operations Specialist
      {
        title: 'Talent Acquisition & HR Operations Specialist',
        employer: employer1._id,
        companyName: 'TechFlow Solutions',
        location: 'Phnom Penh, Cambodia',
        workplaceType: 'On-site',
        jobType: 'Full-time',
        category: 'Human Resources',
        experienceLevel: 'Mid Level',
        salaryMin: 1100,
        salaryMax: 1900,
        currency: 'USD',
        description:
          'Drive human resources operations, candidate recruitment, and company culture initiatives for TechFlow Solutions. You will source top engineering candidates, oversee onboarding orientations, and organize internal team building events.',
        requirements: [
          '2+ years experience in technical recruiting, HR operations, or talent acquisition',
          'Familiarity with Applicant Tracking Systems (ATS) and LinkedIn Recruiter',
          'Knowledge of Cambodian labor laws, payroll administration, and NSSF compliance',
          'Outgoing personality with genuine enthusiasm for building great team cultures',
        ],
        responsibilities: [
          'Source, screen, and interview applicants across technical and non-technical vacancies',
          'Deliver smooth, welcoming onboarding experiences for all new hires',
          'Coordinate company town halls, festive celebrations, and team bonding retreats',
        ],
        benefits: [
          'Central modern office in Phnom Penh with free snacks and beverages',
          'Annual company trip and team celebrations',
          'Full health insurance, life insurance, and paid maternity/paternity leave',
        ],
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        status: 'active',
      },
    ]);

    console.log('📝 Creating demo applications...');
    // Seeker 1 applies to Job 1 (Senior Full-Stack)
    const app1 = await Application.create({
      job: jobs[0]._id,
      applicant: seeker1._id,
      employer: employer1._id,
      fullName: seeker1.name,
      email: seeker1.email,
      phone: seeker1.phone,
      resumeUrl: seeker1.resumeUrl,
      portfolioUrl: seeker1.portfolioUrl,
      coverLetter:
        'Dear Hiring Team,\n\nI am thrilled to apply for the Senior Full-Stack Developer position at TechFlow Solutions. With deep hands-on expertise in the MERN stack (MongoDB, Express, React, Node.js) and a track record of delivering scalable web platforms, I am confident in my ability to contribute significantly to your engineering team.\n\nBest regards,\nVirak Yuth',
      status: 'Interviewing',
      employerNotes: 'Strong MERN stack portfolio. Scheduled technical interview for Thursday 2 PM.',
    });

    // Seeker 2 applies to Job 2 (Senior UI/UX Designer)
    const app2 = await Application.create({
      job: jobs[1]._id,
      applicant: seeker2._id,
      employer: employer1._id,
      fullName: seeker2.name,
      email: seeker2.email,
      phone: seeker2.phone,
      resumeUrl: seeker2.resumeUrl,
      portfolioUrl: seeker2.portfolioUrl,
      coverLetter:
        'Hello TechFlow team,\n\nI have followed your product journey closely and would love to bring my UX research and design system expertise to your team. My portfolio showcases extensive work in enterprise design systems and interactive prototyping.\n\nWarm regards,\nAlice Henderson',
      status: 'Reviewed',
      employerNotes: 'Excellent Figma design system examples. Impressive portfolio.',
    });

    // Seeker 1 applies to Job 4 (Junior Frontend Developer)
    const app3 = await Application.create({
      job: jobs[3]._id,
      applicant: seeker1._id,
      employer: employer1._id,
      fullName: seeker1.name,
      email: seeker1.email,
      phone: seeker1.phone,
      resumeUrl: seeker1.resumeUrl,
      portfolioUrl: seeker1.portfolioUrl,
      coverLetter:
        'Hello TechFlow,\n\nI am also very interested in collaborating on your front-end components using React and Tailwind CSS. I have built several accessible component libraries and look forward to contributing.',
      status: 'Pending',
      employerNotes: 'Under initial review.',
    });

    // Update job applicant counts
    await Job.findByIdAndUpdate(jobs[0]._id, { applicantCount: 1 });
    await Job.findByIdAndUpdate(jobs[1]._id, { applicantCount: 1 });
    await Job.findByIdAndUpdate(jobs[3]._id, { applicantCount: 1 });

    // Add saved jobs for seeker1
    seeker1.savedJobs = [jobs[0]._id, jobs[2]._id, jobs[6]._id, jobs[7]._id];
    await seeker1.save();

    console.log('🎉 Seed completed successfully! Total 20 jobs created.');
    console.log('----------------------------------------------------');
    console.log('Demo Credentials:');
    console.log('Employer 1:  employer@jobportal.com      / password123 (TechFlow Solutions)');
    console.log('Employer 2:  hr@cloudpeak.com            / password123 (CloudPeak Software)');
    console.log('Employer 3:  recruitment@nexustech.io    / password123 (NexusTech Innovations)');
    console.log('Employer 4:  careers@fintechprime.com    / password123 (FinTech Prime)');
    console.log('Job Seeker 1: seeker@jobportal.com       / password123 (Virak Yuth)');
    console.log('Job Seeker 2: alice@jobportal.com        / password123 (Alice Henderson)');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();
