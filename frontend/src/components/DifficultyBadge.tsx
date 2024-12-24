import { difficultyMapping } from "../utils/constanst.ts";

const DifficultyBadge = ({ difficulty }: { difficulty: number }) => {
  const difficultyString = difficultyMapping[difficulty];
  return (
    <span
      className={`badge bg-body-secondary me-2 ${
        difficultyString === "Bronze"
          ? "text-warning-emphasis"
          : difficultyString === "Platinum"
            ? "text-primary"
            : "text-danger"
      }`}
    >
      {difficultyString}
    </span>
  );
};

export default DifficultyBadge;
