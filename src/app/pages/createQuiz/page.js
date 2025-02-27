'use client';
import QuizDetailForm from '@/app/components/quizDetailForm';
import QuizQuesComp from '@/app/components/quizQuesComp';
import QuizSettingsComp from '@/app/components/quizSettingsComp';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function CreateQuiz() {
    const { data: session, status } = useSession();
    const [quizId, setQuizId] = useState(null);
    const [isDetailsSelected, setDetailsSelection] = useState(true);
    const [isQuestionsSelected, setQuestionsSelection] = useState(false);
    const [isSettingsSelected, setSettingsSelection] = useState(false);

    // Check if user is authenticated
    useEffect(() => {
        if (status === 'unauthenticated') {
            toast.warning('You must be signed in to create a quiz.');
            window.location.href = '/auth/login'; // Redirect to sign-in page
        }
    }, [status]);

    if (status === 'loading') {
        return <p>Loading...</p>; // Show loading while checking session
    }

    return (
        <div>
            {isDetailsSelected && !isQuestionsSelected && !isSettingsSelected && (
                <QuizDetailForm
                    setQuizId={setQuizId}
                    setDetailsSelection={setDetailsSelection}
                    setQuestionsSelection={setQuestionsSelection}
                    onNext={() => {
                      setDetailsSelection(false);  // Hide current form
                      setQuestionsSelection(true); // Show QuizQuesComp
                  }}
                />
            )}

            {quizId && isQuestionsSelected && !isSettingsSelected && <QuizQuesComp quizId={quizId} />}
            {quizId && isSettingsSelected && <QuizSettingsComp quizId={quizId} />}
        </div>
    );
}
