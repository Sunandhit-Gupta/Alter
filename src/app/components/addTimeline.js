export default function AddTimeline({ quizId, activeStep, setActiveStep }) {
    const handleStepClick = (step) => {
        if (!quizId) {
            alert('Please complete the quiz details first.');
            return;
        }
        setActiveStep(step);
    };

    return (
        <div className="flex justify-center space-x-4">
            <button
                className={`p-2 rounded-full ${activeStep === 'details' ? 'bg-blue-400' : 'bg-gray-300'}`}
                onClick={() => setActiveStep('details')}
            >
                Details
            </button>

            <button
                className={`p-2 rounded-full ${activeStep === 'questions' ? 'bg-blue-400' : 'bg-gray-300'} ${!quizId && 'cursor-not-allowed opacity-50'}`}
                onClick={() => handleStepClick('questions')}
                disabled={!quizId}
            >
                Questions
            </button>

            <button
                className={`p-2 rounded-full ${activeStep === 'settings' ? 'bg-blue-400' : 'bg-gray-300'} ${!quizId && 'cursor-not-allowed opacity-50'}`}
                onClick={() => handleStepClick('settings')}
                disabled={!quizId}
            >
                Settings
            </button>
        </div>
    );
}
