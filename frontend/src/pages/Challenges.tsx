import React from 'react';

const Challenges: React.FC = () => {
  const challenges = [
    {
      id: 1,
      title: "Hello World",
      difficulty: "Easy",
      description: "Write a program that prints 'Hello, World!' to the console",
      completed: true
    },
    {
      id: 2,
      title: "Factorial Function",
      difficulty: "Easy",
      description: "Create a function that calculates the factorial of a number",
      completed: true
    },
    {
      id: 3,
      title: "FizzBuzz",
      difficulty: "Medium",
      description: "Print numbers 1-100, but replace multiples of 3 with 'Fizz', 5 with 'Buzz', and 15 with 'FizzBuzz'",
      completed: false
    },
    {
      id: 4,
      title: "Palindrome Checker",
      difficulty: "Medium",
      description: "Write a function to check if a string is a palindrome",
      completed: false
    },
    {
      id: 5,
      title: "Binary Search",
      difficulty: "Hard",
      description: "Implement binary search algorithm with flowchart visualization",
      completed: false
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Coding Challenges</h1>
      
      <div className="space-y-4">
        {challenges.map((challenge) => (
          <div key={challenge.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 mr-3">
                    {challenge.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </span>
                  {challenge.completed && (
                    <span className="ml-2 text-green-600">
                      ✓ Completed
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-4">{challenge.description}</p>
              </div>
              <button
                className={`px-4 py-2 rounded font-medium ${
                  challenge.completed
                    ? 'bg-gray-200 text-gray-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {challenge.completed ? 'Review' : 'Start Challenge'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Challenges;