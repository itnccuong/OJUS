export const difficultyMapping: Record<number, string> = {
  1: "Bronze",
  2: "Platinum",
  3: "Master",
};

export interface Tag {
  label: string;
  selected: boolean;
}

export const TagList: Tag[] = [
  { label: "Array", selected: false },
  { label: "String", selected: false },
  { label: "Hash Table", selected: false },
  { label: "Dynamic Programming", selected: false },
  { label: "Math", selected: false },
  { label: "Sorting", selected: false },
  { label: "Greedy", selected: false },
  { label: "Depth-First Search", selected: false },
  { label: "Database", selected: false },
  { label: "Binary Search", selected: false },
  { label: "Matrix", selected: false },
  { label: "Tree", selected: false },
  { label: "Breadth-First Search", selected: false },
];

export const LanguageList = ["C++", "C", "Java", "Python", "Javascript"];

export const languageFeToBeMap: Record<string, string> = {
  Python: "py",
  "C++": "cpp",
  C: "c",
  Java: "java",
  Javascript: "js",
};

export const languageEditorMap: Record<string, string> = {
  Python: "python",
  "C++": "cpp",
  C: "c",
  Java: "java",
  Javascript: "javascript",
};
