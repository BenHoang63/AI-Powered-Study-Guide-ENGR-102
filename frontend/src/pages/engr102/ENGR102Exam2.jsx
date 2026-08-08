import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '../../scripts/auth';
import ExamQuizzer from '../../components/ExamQuizzer';
import refPdf from '../../assets/pdfs/ENGR102_ReferenceSheet.pdf';

const EXAM2_CHAPTERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const ENGR102Exam2 = () => {
    const navigate = useNavigate();

    useEffect(() => {
        authClient.getSession().then(({ data }) => {
            if (data?.user) {
                if (!data.user.email?.includes('@tamu.edu')) {
                    authClient.signOut();
                }
            } else {
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
