export interface UserInterface {
  user_id: number;
  email: string;
  full_name: string;
  username: string;
}

export interface ResponseInterface {
  name: string;
  message: string;
}

export interface ProblemInterface {
  problemId: number;
  title: string;
  description: string;
  status: number;
  userStatus: boolean;
  difficulty: number;
  tags: string;
  timeLimit: number;
  memoryLimit: number;
  authorId: number;
  fileId: number;
}

export interface GetAllProblemsInterface extends ResponseInterface {
  data: {
    problems: ProblemInterface[];
  };
}

export interface GetAllContributionsInterface extends ResponseInterface {
  data: {
    contributions: ProblemInterface[];
  };
}

export interface GetOneProblemInterface extends ResponseInterface {
  data: {
    problem: ProblemInterface;
  };
}

export interface GetOneContributionInterface extends ResponseInterface {
  data: {
    contribute: ProblemInterface;
  };
}
