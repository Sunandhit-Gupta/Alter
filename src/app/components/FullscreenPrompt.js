export default function FullscreenPrompt({ onGoFullscreen }) {
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center bg-black bg-opacity-70 z-50">
        <p className="text-white text-xl mb-4">⚠ You exited fullscreen! Click below to re-enter.</p>
        <button
          onClick={onGoFullscreen}
          className="bg-red-500 text-white px-6 py-3 rounded-lg text-xl font-semibold hover:bg-red-600 pointer-events-auto"
        >
          🔲 Re-Enter Fullscreen
        </button>
      </div>
    );
  }