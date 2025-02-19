'use client'
import AddTimeline from '@/app/components/addTimeline';
import QuizDetailForm from '@/app/components/quizDetailForm';
import QuizQuesComp from '@/app/components/quizQuesComp';
import QuizSettingsComp from '@/app/components/quizSettingsComp';
import { useState } from 'react';

export default function CreateQuiz() {
        const [isDetailsSelected, setDetailsSelection] = useState(true);
        const [isQuestionsSelected, setQuestionsSelection] = useState(false);
        const [isSettingsSelected, setSettingsSelection] = useState(false);

  return (
    <div>

        <AddTimeline
        isDetailsSelected={isDetailsSelected}
        setDetailsSelection={setDetailsSelection}
        isQuestionsSelected={isQuestionsSelected}
        setQuestionsSelection={setQuestionsSelection}
        isSettingsSelected={isSettingsSelected}
        setSettingsSelection={setSettingsSelection}
        />

        {isDetailsSelected &&!isQuestionsSelected &&!isSettingsSelected && <QuizDetailForm/>}
        {isQuestionsSelected && !isSettingsSelected && <QuizQuesComp/>}
        {isSettingsSelected && <QuizSettingsComp/>}
        </div>

  )
}
