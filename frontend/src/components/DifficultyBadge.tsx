const DifficultyBadge = ({ difficulty }: { difficulty: string }) => {
  return (
    <span
      className={`badge bg-body-secondary me-2 ${
        difficulty === "Bronze"
          ? "text-warning-emphasis"
          : difficulty === "Platinum"
            ? "text-primary"
            : "text-danger"
      }`}
    >
      {difficulty}
    </span>
  );
};

export default DifficultyBadge;
