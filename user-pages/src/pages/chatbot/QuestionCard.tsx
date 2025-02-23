import React from 'react';

interface QuestionCardProps {
  question: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  console.log('question', question);

  return (
    <div className="border border-gray-600 rounded-3xl px-[20px] py-[10px] text-center text-black text-[16px] md:text-[24px] hover:bg-[#818181] cursor-pointer">
      {question}
    </div>
  );
};

export default QuestionCard;
