import axios from "axios";

export const fetchPendingQuizzes = async () => {
  const res = await axios.get("/api/quiz/pending");
  return res.data;
};

export const publishQuiz = async (quizId) => {
  await axios.put("/api/quiz/publish", { quizId });
};

export const startQuiz = async (quizId) => {
  await axios.put("/api/quiz/start", { quizId });
};

export const endQuiz = async (quizId) => {
  await axios.put("/api/quiz/end", { quizId });
};

export const updateQuiz = async (quizId, formData) => {
  await axios.put("/api/quiz/pending", { quizId, ...formData });
};

export const deleteQuiz = async (quizId) => {
  await axios.delete("/api/quiz/pending", { data: { quizId } });
};

export const updateQuizSettings = async (quizId, settings) => {
  await axios.put("/api/quiz/settings", { quizId, settings });
};
