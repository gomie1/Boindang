import { Quiz } from '../../types/api/quiz';

interface QuizQuestionProps {
  quiz: Quiz;
  onSelect: (index: number) => void;
  selected: number | null;
  onSubmit: () => void;
  onPrev: () => void;
  showPrev: boolean;
  index: number;
  fixedButton?: boolean;
}

export default function QuizQuestion({ quiz, onSelect, selected, onSubmit, onPrev, showPrev, index, fixedButton = false }: QuizQuestionProps) {
  console.log('POST 요청 quizId:', quiz.quizId, 'selected:', selected, 'options:', quiz.options);
  console.log('선택한 보기:', selected !== null ? quiz.options[selected] : '선택 안됨');

  const ButtonGroup = (
    <div className="flex gap-2 mt-8">
      {showPrev && (
        <button
          className="w-1/2 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold text-lg shadow hover:bg-gray-300 transition"
          onClick={onPrev}
        >
          이전 문제
        </button>
      )}
      <button
        className={`w-full bg-[#6C2FF2] text-white py-3 rounded-xl font-bold text-lg shadow hover:bg-[#4B1DBA] transition flex items-center justify-center gap-2 ${showPrev ? 'w-1/2' : ''}`}
        onClick={onSubmit}
        disabled={selected === null}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        정답 제출
      </button>
    </div>
  );

  return (
    <div>
      <div className="text-3xl font-extrabold text-center mb-2 mt-4">Q{index + 1}</div>
      <div className="text-base font-bold text-center mb-4 text-black">[{quiz.title}]</div>
      <h2 className="text-lg font-bold text-center mb-4">{quiz.question}</h2>
      <div className="flex flex-col gap-3">
        {quiz.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(idx)}
            className={`py-3 rounded-xl border ${selected === idx ? 'bg-[#6C2FF2] text-white' : 'bg-white text-gray-800'} font-semibold`}
          >
            {opt}
          </button>
        ))}
      </div>
      {fixedButton ? (
        <div className="absolute left-0 bottom-0 w-full px-6 pb-28 bg-white z-20">
          {ButtonGroup}
        </div>
      ) : (
        ButtonGroup
      )}
    </div>
  );
}
  