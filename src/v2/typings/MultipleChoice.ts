export interface MultipleChoice {
  question: string;
  answers: {
    choice: Record<string, string>;
    correct: string;
    explanation: string;
  }
}

/*
export const chests = [
  {
    chest_id: 69,
    group: [
      {
        question: "1aLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        answers: {
          choice: {
            a: "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation",
            b: "Ut enim ad minim veniam, quis nostrud exercitation",
            c: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          },
          correct: "a",
          explanation: "1The first web search engine was Archie, created in 1990 by Alan Emtage, a student at McGill University in Montreal. Google was created in 1998 by Larry Page and Sergey Brin while they were attending Stanford University in Stanford, California."
        }
      },
      {
        question: "2aLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        answers: {
          choice: {
            a: "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation",
            b: "Ut enim ad minim veniam, quis nostrud exercitation",
            c: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          },
          correct: "b",
          explanation: "2The first web search engine was Archie, created in 1990 by Alan Emtage, a student at McGill University in Montreal. Google was created in 1998 by Larry Page and Sergey Brin while they were attending Stanford University in Stanford, California."
        }
      },
      {
        question: "3aLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        answers: {
          choice: {
            a: "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation",
            b: "Ut enim ad minim veniam, quis nostrud exercitation",
            c: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          },
          correct: "c",
          explanation: "3The first web search engine was Archie, created in 1990 by Alan Emtage, a student at McGill University in Montreal. Google was created in 1998 by Larry Page and Sergey Brin while they were attending Stanford University in Stanford, California."
        }
      }
    ]
  },
  {
    chest_id: 68,
    group: [
      {
        question: "1bLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        answers: {
          choice: {
            a: "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation",
            b: "Ut enim ad minim veniam, quis nostrud exercitation",
            c: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          },
          correct: "b",
          explanation: "1The first web search engine was Archie, created in 1990 by Alan Emtage, a student at McGill University in Montreal. Google was created in 1998 by Larry Page and Sergey Brin while they were attending Stanford University in Stanford, California."
        }
      },
      {
        question: "2bLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        answers: {
          choice: {
            a: "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation",
            b: "Ut enim ad minim veniam, quis nostrud exercitation",
            c: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          },
          correct: "c",
          explanation: "2The first web search engine was Archie, created in 1990 by Alan Emtage, a student at McGill University in Montreal. Google was created in 1998 by Larry Page and Sergey Brin while they were attending Stanford University in Stanford, California."
        }
      },
      {
        question: "3bLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        answers: {
          choice: {
            a: "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation",
            b: "Ut enim ad minim veniam, quis nostrud exercitation",
            c: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          },
          correct: "a",
          explanation: "3The first web search engine was Archie, created in 1990 by Alan Emtage, a student at McGill University in Montreal. Google was created in 1998 by Larry Page and Sergey Brin while they were attending Stanford University in Stanford, California."
        }
      }
    ]
  },
  {
    chest_id: 67,
    group: [
      {
        question: "1cLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        answers: {
          choice: {
            a: "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation",
            b: "Ut enim ad minim veniam, quis nostrud exercitation",
            c: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          },
          correct: "a",
          explanation: "1The first web search engine was Archie, created in 1990 by Alan Emtage, a student at McGill University in Montreal. Google was created in 1998 by Larry Page and Sergey Brin while they were attending Stanford University in Stanford, California."
        }
      },
      {
        question: "2cLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        answers: {
          choice: {
            a: "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation",
            b: "Ut enim ad minim veniam, quis nostrud exercitation",
            c: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          },
          correct: "c",
          explanation: "2The first web search engine was Archie, created in 1990 by Alan Emtage, a student at McGill University in Montreal. Google was created in 1998 by Larry Page and Sergey Brin while they were attending Stanford University in Stanford, California."
        }
      },
      {
        question: "3cLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        answers: {
          choice: {
            a: "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation",
            b: "Ut enim ad minim veniam, quis nostrud exercitation",
            c: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          },
          correct: "b",
          explanation: "3The first web search engine was Archie, created in 1990 by Alan Emtage, a student at McGill University in Montreal. Google was created in 1998 by Larry Page and Sergey Brin while they were attending Stanford University in Stanford, California."
        }
      }
    ]
  },
  {
    chest_id: 66,
    group: [
      {
        question: "1dLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        answers: {
          choice: {
            a: "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation",
            b: "Ut enim ad minim veniam, quis nostrud exercitation",
            c: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          },
          correct: "c",
          explanation: "1The first web search engine was Archie, created in 1990 by Alan Emtage, a student at McGill University in Montreal. Google was created in 1998 by Larry Page and Sergey Brin while they were attending Stanford University in Stanford, California."
        }
      },
      {
        question: "2dLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        answers: {
          choice: {
            a: "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation",
            b: "Ut enim ad minim veniam, quis nostrud exercitation",
            c: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          },
          correct: "a",
          explanation: "2The first web search engine was Archie, created in 1990 by Alan Emtage, a student at McGill University in Montreal. Google was created in 1998 by Larry Page and Sergey Brin while they were attending Stanford University in Stanford, California."
        }
      },
      {
        question: "3dLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        answers: {
          choice: {
            a: "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation",
            b: "Ut enim ad minim veniam, quis nostrud exercitation",
            c: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          },
          correct: "b",
          explanation: "3The first web search engine was Archie, created in 1990 by Alan Emtage, a student at McGill University in Montreal. Google was created in 1998 by Larry Page and Sergey Brin while they were attending Stanford University in Stanford, California."
        }
      }
    ]
  },
  {
    chest_id: 65,
    group: [
      {
        question: "1eLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        answers: {
          choice: {
            a: "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation",
            b: "Ut enim ad minim veniam, quis nostrud exercitation",
            c: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          },
          correct: "c",
          explanation: "1The first web search engine was Archie, created in 1990 by Alan Emtage, a student at McGill University in Montreal. Google was created in 1998 by Larry Page and Sergey Brin while they were attending Stanford University in Stanford, California."
        }
      },
      {
        question: "2eLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        answers: {
          choice: {
            a: "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation",
            b: "Ut enim ad minim veniam, quis nostrud exercitation",
            c: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          },
          correct: "a",
          explanation: "2The first web search engine was Archie, created in 1990 by Alan Emtage, a student at McGill University in Montreal. Google was created in 1998 by Larry Page and Sergey Brin while they were attending Stanford University in Stanford, California."
        }
      },
      {
        question: "3eLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        answers: {
          choice: {
            a: "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation",
            b: "Ut enim ad minim veniam, quis nostrud exercitation",
            c: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          },
          correct: "b",
          explanation: "3The first web search engine was Archie, created in 1990 by Alan Emtage, a student at McGill University in Montreal. Google was created in 1998 by Larry Page and Sergey Brin while they were attending Stanford University in Stanford, California."
        }
      }
    ]
  },
  {
    chest_id: 64,
    group: [
      {
        question: "1fLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        answers: {
          choice: {
            a: "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation",
            b: "Ut enim ad minim veniam, quis nostrud exercitation",
            c: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          },
          correct: "b",
          explanation: "1The first web search engine was Archie, created in 1990 by Alan Emtage, a student at McGill University in Montreal. Google was created in 1998 by Larry Page and Sergey Brin while they were attending Stanford University in Stanford, California."
        }
      },
      {
        question: "2fLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        answers: {
          choice: {
            a: "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation",
            b: "Ut enim ad minim veniam, quis nostrud exercitation",
            c: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          },
          correct: "a",
          explanation: "2The first web search engine was Archie, created in 1990 by Alan Emtage, a student at McGill University in Montreal. Google was created in 1998 by Larry Page and Sergey Brin while they were attending Stanford University in Stanford, California."
        }
      },
      {
        question: "3fLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        answers: {
          choice: {
            a: "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation",
            b: "Ut enim ad minim veniam, quis nostrud exercitation",
            c: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          },
          correct: "b",
          explanation: "3The first web search engine was Archie, created in 1990 by Alan Emtage, a student at McGill University in Montreal. Google was created in 1998 by Larry Page and Sergey Brin while they were attending Stanford University in Stanford, California."
        }
      }
    ]
  }
];
*/