import { Instruction } from "../app/types";

export const instructions: Instruction[] = [
  {
    id: 1,
    title: "Welcome to the Digit Span Test",
    content: `This test measures your working memory capacity by asking you to remember sequences of digits.

The test will gradually increase in difficulty as you progress.`
  },
  {
    id: 3,
    title: "How It Works",
    content: `You will see a series of digits appear on the screen, one at a time. Your job is to remember them. After the digits disappear, a box will appear. Type the digits you saw in the exact order they were presented.
    
Press ENTER to submit. This will start with short lists and get longer. Try your best!`
  },
  {
    id: 4,
    title: "How It Works",
    content: `The experiment has two conditions.
    
Forward Digit Span: Recall the digits in the same order they are presented.
Backward Digit Span: Recalls the digits in the reverse order.`
  },
  {
    id: 5,
    title: "Test Format",
    content: `The test starts with short sequences and becomes progressively longer. Each digit will appear on the screen for a brief moment.

Pay close attention and try to remember the order.`
  },
  {
    id: 6,
    title: "Important Notes",
    content: `• Give your full attention during the test
• There is no time limit for your responses
• Answer as accurately as possible
• The test will end automatically when complete

Press Space or click "Start Test" to begin.`
  }
];
