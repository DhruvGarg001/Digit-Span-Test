# Digit Span Test

An online psychology experiment designed to measure working memory capacity through forward and backward digit span tasks.

## About This Project

This experiment was developed by [Dhruv Garg](https://www.linkedin.com/in/dhruvgarg001/), a student at Michigan State University, as part of the Honors Option for PSY 200 (Introduction to Psychology) for the Fall 2025 semester.

## What is a Digit Span Test?

The digit span test is a psychological assessment tool that measures working memory capacity. Participants are shown a sequence of digits and must recall them either in the same order (forward span) or in reverse order (backward span). The test progressively increases in difficulty by adding more digits to remember.

## Project Features

- **Forward Digit Span**: Recall digits in the same order they were presented
- **Backward Digit Span**: Recall digits in reverse order
- **Progressive Difficulty**: Tests range from 2 to 10 digits in length
- **Multiple Trials**: 2 trials per sequence length for reliability
- **Detailed Results**: View performance statistics, accuracy graphs, and trial-by-trial breakdown
- **Privacy Focused**: All data stored locally in your browser - nothing sent to external servers

## How It Works

1. **Welcome Screen**: Enter your University ID to begin
2. **Instructions**: Read through step-by-step instructions on how the test works
3. **Forward Span Test**: Remember and type digits in the order shown (18 trials)
4. **Backward Span Test**: Remember and type digits in reverse order (18 trials)
5. **Results**: View your performance with detailed statistics and graphs
6. **Completion**: Option to restart or finish

## Technology Stack

- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: lucide-react

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd digit_span_test

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the experiment.

### Build for Production

```bash
npm run build
npm start
```

## Project Documentation

- [Project Details](https://drive.google.com/file/d/16Vd1rPjxyo2d69F7UikXBG3goB2WSwxQ/view?usp=sharing) - Introduction, Motivation, Results & Expectations
- [Experiment Background](https://drive.google.com/file/d/1ZdsiaaOwVKNxkO45rqh2Xnanz9tHTDBx/view?usp=sharing) - Experiment Background & Research Questions

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Data Privacy

Your University ID is stored locally on your device using browser localStorage. No data is transmitted to external servers during this experiment. All test results remain on your local machine.

## Contact

For questions or feedback, connect with [Dhruv Garg on LinkedIn](https://www.linkedin.com/in/dhruvgarg001/).

## Acknowledgments

This project was created for educational purposes as part of PSY 200 Honors Option at Michigan State University.
