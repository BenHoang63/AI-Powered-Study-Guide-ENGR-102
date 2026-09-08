import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '../../scripts/auth';
import { isAuthorized, isDemoMode } from '../../scripts/demo';
import ExamQuizzer from '../../components/ExamQuizzer';
import exam1Pdf from '../../assets/pdfs/exam1review.pdf';

const EXAM1_CHAPTERS = [13];

const ENGR102Exam1 = () => {
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
            examName="Exam 1"
            chapters={EXAM1_CHAPTERS}
            pdfUrl={exam1Pdf}
            storageKey="exam1"
        />
    );
};

export default ENGR102Exam1;
