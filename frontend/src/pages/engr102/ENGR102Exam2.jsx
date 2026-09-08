import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '../../scripts/auth';
import { isAuthorized, isDemoMode } from '../../scripts/demo';
import ExamQuizzer from '../../components/ExamQuizzer';
import refPdf from '../../assets/pdfs/ENGR102_ReferenceSheet.pdf';

const EXAM2_CHAPTERS = [14];

const ENGR102Exam2 = () => {
    const navigate = useNavigate();

    useEffect(() => {
        authClient.getSession().then(({ data }) => {
            if (data?.user) {
                if (!isAuthorized(data.user.email)) {
                    authClient.signOut();
                }
            } else if (!isDemoMode()) {
                navigate('/');
            }
        });
    }, []);

    return (
        <ExamQuizzer
            examName="Exam 2"
            chapters={EXAM2_CHAPTERS}
            pdfUrl={refPdf}
            storageKey="exam2"
        />
    );
};

export default ENGR102Exam2;
