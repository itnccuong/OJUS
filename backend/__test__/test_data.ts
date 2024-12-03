import { LoginInterface, RegisterConfig } from "../interfaces/api-interface";

export const compileTestCases = [
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
