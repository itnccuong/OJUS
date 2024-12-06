import { LoginInterface, RegisterConfig } from "../interfaces/api-interface";

export const compileFailAnswer = [
  {
    language: "c",
    invalidCode: '#include "studio.h"',
    validCode: '#include "stdio.h"\n\nint main() {\n  printf("Random");\n}',
  },
  {
    language: "cpp",
    invalidCode: '#include "IOStream"',
    validCode:
      '#include <iostream>\n\nint main() {\n  std::cout << "Random";\n}',
  },
  {
    language: "java",
    invalidCode:
      'class Solution{  \n    public static void main(String args[]){  \n     System.out.println("Random string to test compile error")  \n    }  \n}',
    validCode:
      'class Solution{  \n    public static void main(String args[]){  \n     System.out.println("Hello Java");\n    }  \n}',
  },
];

export const correctAnswers = [
  {
    language: "c",
    code: '#include <stdio.h>\n\nint main() {\n  int n;\n  scanf("%d", &n);\n  printf("%d", -n);\n}',
  },
  {
    language: "cpp",
    code: "#include <iostream>\nusing namespace std;\n\nint main() {\n  int i;\n  cin >> i;\n  cout << -i;\n}",
  },
  {
    language: "py",
    code: "import fileinput\n\nfor line in fileinput.input():\n  cur = line.rstrip()\n  print(-int(cur))",
  },
  {
    language: "java",
    code: "import java.util.Scanner;\n\nclass Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(-n);\n    }\n}\n",
  },
  {
    language: "js",
    code: "process.stdin.resume();\nprocess.stdin.setEncoding('utf8');\n\nprocess.stdin.on('data', (input) => {\n  const n = parseInt(input);\n  console.log(-n);\n  process.exit();\n});\n",
  },
];

export const registerData: RegisterConfig = {
  email: "hienvuongnhat@gmail.com2",
  password: "2",
  fullname: "Hien2",
  username: "hien2",
};

export const loginWithUsernameData: LoginInterface = {
  usernameOrEmail: "hien",
  password: "1",
};

export const loginWithEmailData: LoginInterface = {
  usernameOrEmail: "hienvuongnhat@gmail.com",
  password: "1",
};

export const numPending = 4;
export const numAccept = 3;
export const numReject = 2;
