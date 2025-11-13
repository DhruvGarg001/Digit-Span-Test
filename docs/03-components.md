# Components Guide

## Overview

The application consists of 5 main screen components, each handling a specific part of the user journey.

## Component Hierarchy

```
page.tsx (Main Controller)
│
├─ WelcomeScreen
├─ InstructionsScreen
├─ TestScreen
├─ ResultsScreen
└─ ThankYouScreen
```

---

## 1. WelcomeScreen

**File**: `src/components/WelcomeScreen.tsx`

### Purpose
Entry point for the experiment. Collects participant ID and displays project information.

### Props
```typescript
interface WelcomeScreenProps {
  onSubmit: (universityId: string) => void;
}
```

### Features
- University ID input form with validation
- Profile photo display
- Project disclaimer and information
- Links to project documentation
- MIT License mention
- Developer contact information

### Key Sections
1. **Header**: Title and description
2. **ID Form**: Text input with validation
3. **Disclaimer**: Profile photo + project details
4. **Documentation Links**: Google Drive links to project files

### Validation
- Requires non-empty ID
- Trims whitespace
- Submits to parent component

---

## 2. InstructionsScreen

**File**: `src/components/InstructionsScreen.tsx`

### Purpose
Display step-by-step instructions before the test begins.

### Props
```typescript
interface InstructionsScreenProps {
  onNext: () => void;
  currentStep: number;
}
```

### Features
- Multi-step instruction display (4 steps)
- Progress indicator
- Spacebar navigation support
- Next button

### Instruction Steps
1. Overview of the test
2. Forward span explanation with example
3. Backward span explanation with example
4. Final tips and encouragement

### Navigation
- **Spacebar**: Move to next step
- **Next Button**: Click to advance
- **Progress Bar**: Shows current step

### Data Source
Instructions loaded from `src/app/data/instructions.ts`

---

## 3. TestScreen

**File**: `src/components/TestScreen.tsx`

### Purpose
Core test logic. Displays digits, collects responses, evaluates accuracy.

### Props
```typescript
interface TestScreenProps {
  onComplete: (results: TestResults) => void;
}
```

### Features
- Sequential digit display (1 second per digit)
- User input collection
- Forward and backward span testing
- Progress tracking
- Introductory screens for each condition
- Automatic progression through trials

### Test Configuration
```typescript
const MIN_LENGTH = 2;  // Start with 2 digits
const MAX_LENGTH = 10; // End with 10 digits
const TRIALS_PER_LENGTH = 2; // 2 trials at each length
```

### Test Phases

#### 1. Ready Phase
- Shows "Get Ready!" message
- Displays sequence length
- 1 second pause

#### 2. Display Phase
- Shows digits one at a time
- 1 second per digit
- Large text display
- Automatically advances

#### 3. Input Phase
- Text input for user response
- Submit button
- Shows current trial number

### Evaluation Logic

```typescript
function calculateCorrectDigits(sequence, userInput, isBackward) {
  // Compare digit at each position
  // Count matches
  // Return count
}
```

**Important**: Compares position-by-position, not consecutive digits.

### Data Tracking
For each trial:
- `sequence`: Original digit array
- `userResponse`: What user typed
- `correctDigits`: Number of correct positions
- `isFullyCorrect`: Boolean for 100% correct
- `length`: Sequence length

### Progress Calculation
```typescript
// Takes into account both conditions
const progress = (currentTrialNumber / totalTrials) * 100;
```

---

## 4. ResultsScreen

**File**: `src/components/ResultsScreen.tsx`

### Purpose
Display test results with graphs, statistics, and trial details.

### Props
```typescript
interface ResultsScreenProps {
  results: TestResults;
  onRestart: () => void;
  onComplete: () => void;
}
```

### Features
- Completion header with participant ID
- Summary statistics for forward and backward spans
- Two bar graphs
- Collapsible calculation explanations
- Collapsible trial-by-trial results
- Restart and Done buttons

### Statistics Displayed

#### Per Condition (Forward/Backward)
- Total Trials: Number of sequences tested
- Fully Correct: Number of 100% correct responses
- Success Rate: Percentage of fully correct trials
- Maximum Span: Longest fully correct sequence
- Correct Digits Placed: Total correct across all trials
- Accuracy: Percentage of correct digits

### Graph 1: Digit Placement Accuracy
**Type**: Grouped Bar Chart

**Data**:
- Total Digits Shown (gray bars)
- Correct Digits Placed (green bars)
- Grouped by condition (Forward/Backward)

**Purpose**: Show overall accuracy in digit placement

### Graph 2: Maximum Span Achieved
**Type**: Bar Chart

**Data**:
- Maximum span for each condition
- Scale: 0-10
- Color-coded by condition

**Purpose**: Show the longest sequence correctly recalled

### Collapsible Sections

#### 1. Graph Calculation Details
Explains:
- How digit accuracy is calculated
- Example calculations with sample data
- What "correct position" means
- How max span is determined

#### 2. Trial Results
Shows every trial:
- Trial number
- Sequence shown
- User response
- Correct digit count
- Checkmark (✓) or X (✗) for fully correct

### Action Buttons
- **Restart Test**: Go back to welcome screen
- **Done**: Proceed to thank you screen

---

## 5. ThankYouScreen

**File**: `src/components/ThankYouScreen.tsx`

### Purpose
Final screen after completing the experiment.

### Props
None - stateless component

### Features
- Simple thank you message
- Completion confirmation
- Instruction to close window

### Design
- Clean and minimal
- Professional tone
- Centered layout

---

## page.tsx (Main Controller)

**File**: `src/app/page.tsx`

### Purpose
Central state management and screen routing.

### State Variables
```typescript
const [appState, setAppState] = useState<AppState>("welcome");
const [universityId, setUniversityId] = useState("");
const [testResults, setTestResults] = useState<TestResults | null>(null);
const [currentInstructionStep, setCurrentInstructionStep] = useState(0);
```

### Handler Functions

#### handleIdSubmit
- Receives University ID from WelcomeScreen
- Saves to state and localStorage
- Transitions to instructions

#### handleInstructionNext
- Advances instruction step
- When complete, transitions to test

#### handleTestComplete
- Receives test results
- Saves to state and localStorage
- Transitions to results

#### handleRestart
- Resets all state
- Clears localStorage
- Returns to welcome

#### handleComplete
- Transitions to thank you screen

### Conditional Rendering
```typescript
{appState === "welcome" && <WelcomeScreen onSubmit={handleIdSubmit} />}
{appState === "instructions" && <InstructionsScreen ... />}
{appState === "test" && <TestScreen onComplete={handleTestComplete} />}
{appState === "results" && <ResultsScreen ... />}
{appState === "thankyou" && <ThankYouScreen />}
```

---

## Data Files

### instructions.ts
**File**: `src/app/data/instructions.ts`

Array of instruction objects:
```typescript
export const instructions = [
  {
    step: 1,
    title: "...",
    content: "..."
  },
  // ... 4 steps total
];
```

### sequences.ts
**File**: `src/app/data/sequences.ts`

Pre-generated sequences:
```typescript
export const digitSequences = {
  2: { trial1: [...], trial2: [...] },
  3: { trial1: [...], trial2: [...] },
  // ... up to 10
};

export function getSequence(length, trial) {
  return digitSequences[length][trial];
}
```

**Important**: No consecutive duplicate digits to avoid ambiguity.

---

## Common Props Pattern

### Callback Props
Most components receive callback functions to communicate upward:
```typescript
onSubmit: (data) => void
onNext: () => void
onComplete: (results) => void
```

### Data Props
Components receive necessary data from parent:
```typescript
results: TestResults
currentStep: number
```

This pattern keeps data flow unidirectional and predictable.
