"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function useQuizData(quizId, isSubmitted, setResponses) {
  const [questions, setQuestions] = useState([]);
  const [quizData, setQuizData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (isSubmitted || !quizId) return;

      try {
        // Get both quiz data and questions
        const res = await axios.get(`/api/quiz/${quizId}/questions`);

        if (res.data.success) {
          const quiz = res.data.quiz || {}; // Get quiz data if available
          setQuizData(quiz);

          let fetchedQuestions = res.data.questions;

          // If quiz has shuffleQuestions enabled, shuffle the questions array
          if (quiz.shuffleQuestions) {
            fetchedQuestions = shuffleArray([...fetchedQuestions]);

            // Also shuffle options for MCQ questions
            fetchedQuestions = fetchedQuestions.map(question => {
              if (question.options && question.options.length > 0) {
                return {
                  ...question,
                  options: shuffleArray([...question.options])
                };
              }
              return question;
            });
          }

          setQuestions(fetchedQuestions);

          // Initialize responses
          const initialResponses = {};
          fetchedQuestions.forEach((q) => {
            initialResponses[q._id] = [];
          });
          setResponses(initialResponses);
        } else {
          setError(res.data.message);
        }
      } catch (err) {
        console.error("Error fetching quiz data:", err);
        setError("Failed to load quiz questions.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [quizId, isSubmitted, setResponses]);

  // Fisher-Yates (Knuth) shuffle algorithm
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  return { questions, quizData, error, loading };
}