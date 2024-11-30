export interface UserInterface {
  user_id: number;
  email: string;
  full_name: string;
  username: string;
}

export interface ContributionInterface {
  problemId: number;
  title: string;
  description: string;
  isActive: boolean;
  difficulty: number;
  tags: string;
  timeLimit: number;
  memoryLimit: number;
}

export interface GetAllContributionInterface {
  data: {
    contributions: ContributionInterface[];
  };
}
