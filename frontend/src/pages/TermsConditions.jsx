import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, FileText, ShieldAlert, Mail, Calendar, Scale } from 'lucide-react';
import Footer from '../components/Footer.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';

const TOC_ITEMS = [
    { id: 'services', label: '1. Our Services' },
    { id: 'ip', label: '2. Intellectual Property Rights' },
    { id: 'representations', label: '3. User Representations' },
    { id: 'prohibited', label: '4. Prohibited Activities' },
    { id: 'contributions', label: '5. User Generated Contributions' },
    { id: 'license', label: '6. Contribution License' },
    { id: 'management', label: '7. Services Management' },
    { id: 'termination', label: '8. Term and Termination' },
    { id: 'modifications', label: '9. Modifications and Interruptions' },
    { id: 'governing-law', label: '10. Governing Law' },
    { id: 'disputes', label: '11. Dispute Resolution' },
    { id: 'corrections', label: '12. Corrections' },
    { id: 'disclaimer', label: '13. Disclaimer' },
    { id: 'liability', label: '14. Limitations of Liability' },
    { id: 'indemnification', label: '15. Indemnification' },
    { id: 'userdata', label: '16. User Data' },
    { id: 'electronic', label: '17. Electronic Communications & Signatures' },
    { id: 'miscellaneous', label: '18. Miscellaneous' },
    { id: 'contact', label: '19. Contact Us' },
];

const TermsConditions = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-so-bg text-so-text-body font-sans antialiased selection:bg-[#990000]/60 selection:text-white flex flex-col">
            {/* Header / Navigation Bar */}
            <header className="sticky top-0 z-40 bg-[#161616]/95 backdrop-blur border-b border-so-border">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleBack}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-white/90 hover:text-slate-900 dark:hover:text-white bg-so-surface hover:bg-so-hover border border-so-border rounded px-2.5 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#990000]"
                            title="Go back"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 text-slate-700 dark:text-white" />
                            <span>Back</span>
                        </button>

                        <div className="h-4 w-px bg-so-border" />

                        <Link to="/" className="flex items-center gap-2 group">
                            {/* <div className="w-7 h-7 rounded bg-[#990000] border border-[#b30000]/50 flex items-center justify-center transition-colors">
                                <span className="text-white font-bold text-xs tracking-tighter">≡</span>
                            </div> */}
                            <span className="text-sm font-semibold text-white tracking-tight group-hover:text-neutral-200 transition-colors">
                                ENGR Study Helper
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <Link
                            to="/"
                            className="text-xs font-medium text-so-text-muted hover:text-white transition-colors"
                        >
                            Sign In Portal
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <div className="so-card p-6 sm:p-10 border-so-border shadow-so-md space-y-8">
                    
                    {/* Document Header */}
                    <div className="border-b border-so-border pb-6 space-y-3">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                            Terms of Use
                        </h1>
                        <div className="flex items-center gap-2 text-xs text-so-text-muted">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Last updated: <strong className="text-white font-medium">September 21, 2026</strong></span>
                        </div>
                    </div>

                    {/* Agreement to Legal Terms */}
                    <section className="space-y-3 text-sm leading-relaxed text-so-text-body">
                        <p>
                            We are <strong className="text-white font-semibold">Benjamin Hoang</strong> ("<strong>Company</strong>," "<strong>we</strong>," "<strong>us</strong>," "<strong>our</strong>").
                        </p>
                        <p>
                            We operate the website <a href="https://engr-study-helper.onrender.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">https://engr-study-helper.onrender.com</a>, as well as any other related products and services that refer or link to these legal terms (the "<strong>Legal Terms</strong>") (collectively, the "<strong>Services</strong>"). The Services comprise <strong className="text-white">ENGR Study Helper</strong>, an AI-powered educational web application designed to help first-year engineering students learn Python and master concepts for Texas A&M ENGR 102.
                        </p>
                        <p>
                            You can contact us by email at{' '}
                            <a href="mailto:benhoangsuper@gmail.com" className="text-blue-400 hover:text-blue-300 underline underline-offset-2 font-mono">
                                benhoangsuper@gmail.com
                            </a>{' '}
                            or by mail to Benjamin Hoang, Sugar Land, TX 77498, United States.
                        </p>
                        <p>
                            These Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("<strong>you</strong>"), and Benjamin Hoang, concerning your access to and use of the Services. You agree that by accessing the Services, you have read, understood, and agreed to be bound by all of these Legal Terms. <strong className="text-white">IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.</strong>
                        </p>
                    </section>

                    {/* Quick Summary Notice */}
                    <div className="p-4 sm:p-5 rounded bg-so-surface border border-so-border space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-white font-semibold text-sm">
                            {/* <Scale className="w-4 h-4 text-[#ff8080]" /> */}
                            <span>Academic & Supplemental Tool Notice</span>
                        </div>
                        <p className="text-so-text-muted leading-relaxed">
                            ENGR Study Helper is an independent, student-developed supplementary study aid. It is <span className="text-white font-medium">not affiliated with, sponsored by, or officially endorsed by Texas A&M University</span>. This platform is designed solely for personal educational study and exam preparation.
                        </p>
                    </div>

                    {/* Table of Contents */}
                    <section className="border-t border-so-borderSubtle pt-6 space-y-3">
                        <h2 className="text-xs font-semibold text-so-text-muted uppercase tracking-wider">
                            Table of Contents
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {TOC_ITEMS.map((item) => (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    className="p-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 dark:bg-so-surface/60 dark:hover:bg-so-hover dark:border-so-borderSubtle dark:text-so-text-body dark:hover:text-white transition-colors truncate"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </section>

                    {/* Section 1: Our Services */}
                    <section id="services" className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6 scroll-mt-20">
                        <h2 className="text-lg font-bold text-white tracking-tight">
                            Our Services
                        </h2>
                        <p>
                            The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country. Accordingly, those persons who choose to access the Services from other locations do so on their own initiative and are solely responsible for compliance with local laws, if and to the extent local laws are applicable.
                        </p>
                        <p>
                            The Services are not tailored to comply with industry-specific regulations (such as HIPAA, FISMA, etc.), so if your interactions would be subjected to such laws, you may not use these Services.
                        </p>
                    </section>

                    {/* Section 2: Intellectual Property Rights */}
                    <section id="ip" className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6 scroll-mt-20">
                        <h2 className="text-lg font-bold text-white tracking-tight">
                            Intellectual Property Rights
                        </h2>
                        <p>
                            <strong className="text-white">Our Intellectual Property:</strong> We are the owner or licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Services (collectively, the "Content"), as well as the trademarks, service marks, and logos contained therein (the "Marks").
                        </p>
                        <p>
                            <strong className="text-white">Your Use of Our Services:</strong> Subject to your compliance with these Legal Terms, including the "Prohibited Activities" section below, we grant you a non-exclusive, non-transferable, revocable license to access the Services and download or print a copy of any portion of the Content to which you have properly gained access solely for your personal, non-commercial educational study use.
                        </p>
                        <p>
                            Except as set out in this section or elsewhere in our Legal Terms, no part of the Services and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever without our express prior written permission.
                        </p>
                        <p>
                            <strong className="text-white">Your Submissions:</strong> By directly sending us any question, comment, suggestion, idea, feedback, or other information about the Services ("Submissions"), you agree to assign to us all intellectual property rights in such Submission. You agree that we shall own this Submission and be entitled to its unrestricted use and dissemination for any lawful purpose, commercial or otherwise, without acknowledgment or compensation to you.
                        </p>
                    </section>

                    {/* Section 3: User Representations */}
                    <section id="representations" className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6 scroll-mt-20">
                        <h2 className="text-lg font-bold text-white tracking-tight">
                            User Representations
                        </h2>
                        <p>
                            By using the Services, you represent and warrant that:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-xs">
                            <li>You have the legal capacity and you agree to comply with these Legal Terms;</li>
                            <li>You are not a minor in the jurisdiction in which you reside, or if a minor, you have received parental permission to use the Services;</li>
                            <li>You will not access the Services through automated or non-human means, whether through a bot, script, crawler, or otherwise;</li>
                            <li>You will not use the Services for any illegal or unauthorized purpose; and</li>
                            <li>Your use of the Services will not violate any applicable law or regulation, or any institutional academic integrity honor code.</li>
                        </ul>
                    </section>

                    {/* Section 4: Prohibited Activities */}
                    <section id="prohibited" className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6 scroll-mt-20">
                        <h2 className="text-lg font-bold text-white tracking-tight">
                            Prohibited Activities
                        </h2>
                        <p>
                            You may not access or use the Services for any purpose other than that for which we make the Services available. As a user of the Services, you agree not to:
                        </p>
                        <ul className="list-disc pl-5 space-y-1.5 text-xs text-so-text-muted">
                            <li>Systematically retrieve data, questions, or other content from the Services to create or compile a collection, compilation, database, or directory without written permission from us.</li>
                            <li>Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information or authentication sessions.</li>
                            <li>Circumvent, disable, or otherwise interfere with security-related features of the Services, including features that enforce limitations on the use of the Services or prevent unauthorized copying.</li>
                            <li>Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Services.</li>
                            <li>Use any information obtained from the Services in order to harass, abuse, or harm another person.</li>
                            <li>Make improper use of our support services or submit false reports of abuse or misconduct.</li>
                            <li>Use the Services in a manner inconsistent with any applicable laws or regulations.</li>
                            <li>Upload or transmit viruses, Trojan horses, or other material, including continuous spamming or automated submission flooding, that impairs any party's use and enjoyment of the Services.</li>
                            <li>Engage in any automated use of the system, such as using scripts to spam questions, scrape answer keys, or mine AI responses.</li>
                            <li>Attempt to impersonate another student or use the account or student email of another user.</li>
                            <li>Except as permitted by applicable law, decipher, decompile, disassemble, or reverse engineer any of the software comprising the Services.</li>
                            <li>Use the Services as part of any commercial revenue-generating enterprise.</li>
                        </ul>
                    </section>

                    {/* Section 5: Contributions */}
                    <section id="contributions" className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6 scroll-mt-20">
                        <h2 className="text-lg font-bold text-white tracking-tight">
                            User Generated Contributions
                        </h2>
                        <p>
                            The Services does not offer users the ability to publicly submit or post social content. We may provide you with the opportunity to create, submit, or transmit feedback, bug reports, survey responses, code solutions, or study inputs (collectively, "Contributions"). When you submit Contributions, you represent and warrant that your Contributions do not violate the intellectual property rights or personal rights of any third party.
                        </p>
                    </section>

                    {/* Section 6: Contribution License */}
                    <section id="license" className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6 scroll-mt-20">
                        <h2 className="text-lg font-bold text-white tracking-tight">
                            Contribution License
                        </h2>
                        <p>
                            You and the Services agree that we may access, store, process, and use any information and personal data that you provide in accordance with our Privacy Policy.
                        </p>
                        <p>
                            By submitting suggestions, bug reports, or other feedback regarding the Services, you agree that we can use and share such feedback for any purpose (such as improving study materials and fixing application bugs) without compensation to you.
                        </p>
                    </section>

                    {/* Section 7: Services Management */}
                    <section id="management" className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6 scroll-mt-20">
                        <h2 className="text-lg font-bold text-white tracking-tight">
                            Services Management
                        </h2>
                        <p>
                            We reserve the right, but not the obligation, to: (1) monitor the Services for violations of these Legal Terms; (2) take appropriate legal action against anyone who violates the law or these Legal Terms; (3) in our sole discretion and without limitation, refuse, restrict access to, limit the availability of, or disable any user account or portion thereof; (4) remove from the Services or otherwise disable all files and content that are excessive in size or burdensome to our systems; and (5) otherwise manage the Services in a manner designed to protect our rights and property and facilitate proper functioning.
                        </p>
                    </section>

                    {/* Section 8: Term and Termination */}
                    <section id="termination" className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6 scroll-mt-20">
                        <h2 className="text-lg font-bold text-white tracking-tight">
                            Term and Termination
                        </h2>
                        <p>
                            These Legal Terms shall remain in full force and effect while you use the Services. WITHOUT LIMITING ANY OTHER PROVISION OF THESE LEGAL TERMS, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SERVICES (INCLUDING BLOCKING CERTAIN IP ADDRESSES OR RESTRICTING GOOGLE AUTHENTICATION SESSIONS), TO ANY PERSON FOR ANY REASON OR FOR NO REASON, INCLUDING WITHOUT LIMITATION FOR BREACH OF ANY REPRESENTATION, WARRANTY, OR COVENANT CONTAINED IN THESE LEGAL TERMS OR OF ANY APPLICABLE LAW OR REGULATION.
                        </p>
                    </section>

                    {/* Section 9: Modifications and Interruptions */}
                    <section id="modifications" className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6 scroll-mt-20">
                        <h2 className="text-lg font-bold text-white tracking-tight">
                            Modifications and Interruptions
                        </h2>
                        <p>
                            We reserve the right to change, modify, or remove the contents of the Services at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Services.
                        </p>
                        <p>
                            We cannot guarantee the Services will be available at all times. We may experience hardware, software, or other problems or need to perform maintenance related to the Services, resulting in interruptions, delays, or errors. You agree that we have no liability whatsoever for any loss, damage, or inconvenience caused by your inability to access or use the Services during any downtime or discontinuance.
                        </p>
                    </section>

                    {/* Section 10: Governing Law */}
                    <section id="governing-law" className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6 scroll-mt-20">
                        <h2 className="text-lg font-bold text-white tracking-tight">
                            Governing Law
                        </h2>
                        <p>
                            These Legal Terms and your use of the Services are governed by and construed in accordance with the laws of the <strong className="text-white">State of Texas, United States</strong>, without regard to its conflict of law principles. You irrevocably consent that the state and federal courts located in Texas, United States shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these Legal Terms.
                        </p>
                    </section>

                    {/* Section 11: Dispute Resolution */}
                    <section id="disputes" className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6 scroll-mt-20">
                        <h2 className="text-lg font-bold text-white tracking-tight">
                            Dispute Resolution
                        </h2>
                        <p>
                            <strong className="text-white">Informal Negotiations:</strong> To expedite resolution and control the cost of any dispute, controversy, or claim related to these Legal Terms, the Parties agree to first attempt to negotiate any Dispute informally for at least thirty (30) days before initiating arbitration or court proceedings. Such informal negotiations commence upon written notice to <code className="text-white bg-[#990000]/25 border border-[#990000]/50 px-1.5 py-0.5 rounded font-mono">benhoangsuper@gmail.com</code>.
                        </p>
                        <p>
                            <strong className="text-white">Binding Arbitration:</strong> If the Parties are unable to resolve a Dispute through informal negotiations, the Dispute will be resolved through binding individual arbitration under the commercial arbitration rules of the American Arbitration Association (AAA). You understand that without this provision, you would have the right to sue in court and have a jury trial.
                        </p>
                    </section>

                    {/* Section 12: Corrections */}
                    <section id="corrections" className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6 scroll-mt-20">
                        <h2 className="text-lg font-bold text-white tracking-tight">
                            Corrections
                        </h2>
                        <p>
                            There may be information on the Services that contains typographical errors, inaccuracies, or omissions, including descriptions, curriculum explanations, and practice question keys. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update the information on the Services at any time, without prior notice.
                        </p>
                    </section>

                    {/* Section 13: Disclaimer */}
                    <section id="disclaimer" className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6 scroll-mt-20">
                        <h2 className="text-lg font-bold text-white tracking-tight">
                            Disclaimer
                        </h2>
                        <div className="p-4 rounded bg-[#990000]/15 border border-[#990000]/50 text-xs space-y-2 text-neutral-100">
                            <p className="font-semibold text-white uppercase tracking-wider">
                                AS-IS Educational Tool Disclaimer
                            </p>
                            <p>
                                THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SERVICES AND YOUR USE THEREOF, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                            </p>
                            <p>
                                ENGR STUDY HELPER IS AN INDEPENDENT EDUCATIONAL STUDY AID DEVELOPED FOR STUDENTS. IT IS NOT AFFILIATED WITH, SPONSORED BY, OR ENDORSED BY TEXAS A&M UNIVERSITY. WE MAKE NO WARRANTIES OR REPRESENTATIONS REGARDING SPECIFIC ACADEMIC OUTCOMES, GRADES, OR EXAM RESULTS DERIVED FROM USING THIS STUDY AID.
                            </p>
                        </div>
                    </section>

                    {/* Section 14: Limitations of Liability */}
                    <section id="liability" className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6 scroll-mt-20">
                        <h2 className="text-lg font-bold text-white tracking-tight">
                            Limitations of Liability
                        </h2>
                        <p className="text-xs uppercase text-so-text-muted">
                            IN NO EVENT WILL WE OR OUR CONTRIBUTORS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED HEREIN, OUR LIABILITY TO YOU FOR ANY CAUSE WHATSOEVER WILL AT ALL TIMES BE LIMITED TO THE LESSER OF THE AMOUNT PAID, IF ANY, BY YOU TO US DURING THE SIX (6) MONTH PERIOD PRIOR TO ANY CAUSE OF ACTION ARISING OR $50.00 USD.
                        </p>
                    </section>

                    {/* Section 15: Indemnification */}
                    <section id="indemnification" className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6 scroll-mt-20">
                        <h2 className="text-lg font-bold text-white tracking-tight">
                            Indemnification
                        </h2>
                        <p>
                            You agree to defend, indemnify, and hold us harmless from and against any loss, damage, liability, claim, or demand, including reasonable attorneys' fees and expenses, made by any third party due to or arising out of: (1) your use of the Services; (2) breach of these Legal Terms; (3) any breach of your representations and warranties set forth in these Legal Terms; or (4) your violation of the rights of a third party, including intellectual property rights.
                        </p>
                    </section>

                    {/* Section 16: User Data */}
                    <section id="userdata" className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6 scroll-mt-20">
                        <h2 className="text-lg font-bold text-white tracking-tight">
                            User Data
                        </h2>
                        <p>
                            We will maintain certain data that you transmit to the Services for the purpose of managing the performance of the Services, as well as data relating to your study activity and quiz accuracy. Although we perform regular routine backups, you are solely responsible for all data that you transmit. You agree that we shall have no liability to you for any loss or corruption of any such data.
                        </p>
                    </section>

                    {/* Section 17: Electronic Communications */}
                    <section id="electronic" className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6 scroll-mt-20">
                        <h2 className="text-lg font-bold text-white tracking-tight">
                            Electronic Communications, Transactions, and Signatures
                        </h2>
                        <p>
                            Visiting the Services, sending us emails, and completing online feedback forms constitute electronic communications. You consent to receive electronic communications, and you agree that all agreements, notices, disclosures, and other communications we provide to you electronically, via email and on the Services, satisfy any legal requirement that such communication be in writing.
                        </p>
                    </section>

                    {/* Section 18: Miscellaneous */}
                    <section id="miscellaneous" className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6 scroll-mt-20">
                        <h2 className="text-lg font-bold text-white tracking-tight">
                            Miscellaneous
                        </h2>
                        <p>
                            These Legal Terms and any policies or operating rules posted by us on the Services constitute the entire agreement and understanding between you and us. Our failure to exercise or enforce any right or provision of these Legal Terms shall not operate as a waiver of such right or provision. If any provision of these Legal Terms is determined to be unlawful, void, or unenforceable, that provision is deemed severable and does not affect the validity of remaining provisions.
                        </p>
                    </section>

                    {/* Section 19: Contact Us */}
                    <section id="contact" className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6 scroll-mt-20">
                        <h2 className="text-lg font-bold text-white tracking-tight">
                            Contact Us
                        </h2>
                        <p>
                            In order to resolve a complaint regarding the Services or to receive further information regarding use of the Services, please contact us at:
                        </p>
                        <div className="p-4 rounded bg-so-surface border border-so-border space-y-2 text-xs">
                            <div className="font-semibold text-white text-sm">Benjamin Hoang</div>
                            <div className="text-so-text-muted">Sugar Land, TX 77498, United States</div>
                            <div className="flex items-center gap-2 text-so-text-body pt-1">
                                <Mail className="w-3.5 h-3.5 text-so-text-muted" />
                                <span>Email: </span>
                                <a 
                                    href="mailto:benhoangsuper@gmail.com" 
                                    className="text-blue-400 hover:text-blue-300 underline underline-offset-2 font-mono"
                                >
                                    benhoangsuper@gmail.com
                                </a>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* Global Footer */}
            <Footer />
        </div>
    );
};

export default TermsConditions;
