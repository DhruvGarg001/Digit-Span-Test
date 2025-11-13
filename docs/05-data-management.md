# Data Management

## Overview

This document explains how data flows through the application, what gets stored, and how calculations are performed.

## Data Storage Locations

### 1. localStorage (Browser)
Persists data across browser sessions.

**Stored Data**:
```typescript
// University ID
localStorage.setItem("universityId", "A12345678");

// Test results (backup)
localStorage.setItem("testResults", JSON.stringify(results));
```

**When Cleared**:
- User clicks "Restart Test"
- User clears browser data
- Incognito/Private mode ends

### 2. React State (Memory)
Temporary data during session.

**Central State** (in `page.tsx`):
```typescript
appState: AppState
universityId: string
testResults: TestResults | null
currentInstructionStep: number
```

**Component State** (in `TestScreen.tsx`):
```typescript
condition: TestCondition
currentLength: number
currentTrial: number
phase: TestPhase
sequence: string[]
userInput: string
displayIndex: number
forwardTrials: Trial[]
backwardTrials: Trial[]
```

---

## Type Definitions

### AppState
```typescript
type AppState = 
  | "welcome"
  | "instructions"
  | "test"
  | "results"
  | "thankyou";
```

Controls which screen is displayed.

### TestCondition
```typescript
type TestCondition = "forward" | "backward";
```

Which test is currently running.

### TestPhase
```typescript
type TestPhase = "ready" | "display" | "input";
```

Current phase within a trial.

### Trial
```typescript
interface Trial {
  sequence: number[];       // Original digits shown
  userResponse: string;     // What user typed
  correctDigits: number;    // Number of correct positions
  isFullyCorrect: boolean;  // 100% correct?
  length: number;           // Sequence length
}
```

Stores data for one trial.

### TestResults
```typescript
interface TestResults {
  universityId: string;
  completedAt: number;           // Timestamp
  
  forwardTrials: Trial[];        // All forward trials (18)
  forwardTotalResponses: number; // Always 18
  forwardTotalCorrect: number;   // Fully correct count
  forwardMaxSpan: number;        // Longest correct sequence
  
  backwardTrials: Trial[];       // All backward trials (18)
  backwardTotalResponses: number;
  backwardTotalCorrect: number;
  backwardMaxSpan: number;
}
```

Final results object passed to ResultsScreen.

---

## Data Flow

### 1. User Enters ID

```
WelcomeScreen
    ↓ onSubmit(id)
page.tsx
    ↓ setUniversityId(id)
    ↓ localStorage.setItem("universityId", id)
State Updated
```

### 2. Instructions Progression

```
InstructionsScreen
    ↓ onNext()
page.tsx
    ↓ setCurrentInstructionStep(step + 1)
State Updated
    ↓ if (step >= 4)
    ↓ setAppState("test")
TestScreen Rendered
```

### 3. Test Execution

```
TestScreen Mounts
    ↓ Initialize state
    ↓ Load sequence from sequences.ts
    ↓ Start timer for "ready" phase
    
Display Phase
    ↓ Show digits one by one
    ↓ Timer increments displayIndex
    ↓ After last digit → Input phase
    
Input Phase
    ↓ User types response
    ↓ Click Submit
    ↓ Evaluate response
    ↓ Create Trial object
    ↓ Add to trials array
    ↓ Move to next trial
    
After All Trials
    ↓ Build TestResults object
    ↓ Call onComplete(results)
    
page.tsx
    ↓ setTestResults(results)
    ↓ localStorage.setItem("testResults", JSON.stringify(results))
    ↓ setAppState("results")
ResultsScreen Rendered
```

### 4. Results Display

```
ResultsScreen
    ↓ Receive results prop
    ↓ Calculate statistics
    ↓ Prepare chart data
    ↓ Render graphs and details
    
User clicks "Restart"
    ↓ onRestart()
    
page.tsx
    ↓ Clear all state
    ↓ localStorage.clear()
    ↓ setAppState("welcome")
```

---

## Calculations

### 1. Correct Digits (Per Trial)

**Function**: `calculateCorrectDigits()`

```typescript
function calculateCorrectDigits(
  sequence: string[],
  userInput: string,
  isBackward: boolean
): number {
  const expectedSequence = isBackward 
    ? [...sequence].reverse() 
    : sequence;
  
  const userDigits = userInput.split("");
  
  let correctCount = 0;
  for (let i = 0; i < expectedSequence.length; i++) {
    if (userDigits[i] === expectedSequence[i]) {
      correctCount++;
    }
  }
  
  return correctCount;
}
```

**Example**:
- Sequence: `[3, 7, 9, 2]`
- User input: `"3972"`
- Expected (forward): `["3", "7", "9", "2"]`
- User digits: `["3", "9", "7", "2"]`
- Position comparison:
  - 0: `"3" === "3"` → ✓
  - 1: `"9" !== "7"` → ✗
  - 2: `"7" !== "9"` → ✗
  - 3: `"2" === "2"` → ✓
- **Result**: 2 correct digits

### 2. Total Correct Trials

```typescript
const forwardTotalCorrect = forwardTrials.filter(
  trial => trial.isFullyCorrect
).length;
```

Counts trials where user got 100% of digits correct.

### 3. Maximum Span

```typescript
const forwardMaxSpan = Math.max(
  ...forwardTrials
    .filter(t => t.isFullyCorrect)
    .map(t => t.length),
  0  // Default if no correct trials
);
```

Finds the longest sequence that was fully correct.

**Example**:
- Fully correct trials: lengths 2, 2, 3, 3, 4, 5
- Maximum: 5

### 4. Total Digits Shown

```typescript
const forwardTotalDigitsShown = forwardTrials.reduce(
  (sum, trial) => sum + trial.length,
  0
);
```

Sums all sequence lengths.

**Calculation**:
- 2 trials × 9 lengths × (2+3+4+5+6+7+8+9+10) digits
- 2 trials each at: 2, 3, 4, 5, 6, 7, 8, 9, 10
- Total: 2×2 + 2×3 + 2×4 + ... + 2×10
- Total: 4 + 6 + 8 + 10 + 12 + 14 + 16 + 18 + 20
- **Total: 108 digits per condition**

Wait, that's 108, not 110. Let me recalculate:
- Lengths: 2, 3, 4, 5, 6, 7, 8, 9, 10
- Sum: 2+3+4+5+6+7+8+9+10 = 54
- Two trials each: 54 × 2 = 108

**Correct total: 108 digits per condition**

### 5. Correct Digits Placed

```typescript
const forwardCorrectDigitsPlaced = forwardTrials.reduce(
  (sum, trial) => sum + trial.correctDigits,
  0
);
```

Sums the `correctDigits` field from all trials.

### 6. Accuracy Percentage

```typescript
const forwardAccuracy = forwardTotalDigitsShown > 0
  ? (forwardCorrectDigitsPlaced / forwardTotalDigitsShown * 100).toFixed(1)
  : "0.0";
```

Percentage of all digit positions that were correct.

### 7. Success Rate

```typescript
const successRate = (
  (forwardTotalCorrect / forwardTotalResponses) * 100
).toFixed(1);
```

Percentage of trials that were 100% correct.

---

## Chart Data Preparation

### Graph 1: Digit Placement Accuracy

```typescript
const correctDigitsData = {
  labels: ["Forward Span", "Backward Span"],
  datasets: [
    {
      label: "Total Digits Shown",
      data: [forwardTotalDigitsShown, backwardTotalDigitsShown],
      backgroundColor: "rgba(156, 163, 175, 0.6)",  // Gray
      borderColor: "rgba(156, 163, 175, 1)",
      borderWidth: 2
    },
    {
      label: "Correct Digits Placed",
      data: [forwardCorrectDigitsPlaced, backwardCorrectDigitsPlaced],
      backgroundColor: "rgba(24, 84, 58, 0.8)",     // Green
      borderColor: "rgba(24, 84, 58, 1)",
      borderWidth: 2
    }
  ]
};
```

**Result**: Grouped bar chart comparing total vs correct for each condition.

### Graph 2: Maximum Span

```typescript
const maxSpanData = {
  labels: ["Forward Span", "Backward Span"],
  datasets: [
    {
      label: "Maximum Span Achieved",
      data: [results.forwardMaxSpan, results.backwardMaxSpan],
      backgroundColor: [
        "rgba(24, 84, 58, 0.8)",   // Green for forward
        "rgba(79, 70, 229, 0.8)"   // Indigo for backward
      ],
      borderColor: [
        "rgba(24, 84, 58, 1)",
        "rgba(79, 70, 229, 1)"
      ],
      borderWidth: 2
    }
  ]
};
```

**Result**: Bar chart showing max span per condition (scale 0-10).

---

## Data Validation

### ID Validation
```typescript
if (universityId.trim()) {
  onSubmit(universityId.trim());
}
```

Ensures non-empty ID after trimming whitespace.

### Input Validation
```typescript
required  // HTML5 validation on input field
```

Browser prevents empty submission.

### Type Safety
TypeScript ensures:
- Correct prop types passed between components
- State updates match expected types
- Function signatures are correct

---

## Data Privacy

### What's Stored
- University ID (local only)
- Test responses (local only)
- Timestamps (local only)

### What's NOT Stored
- No personal information
- No external database
- No server communication
- No cookies
- No tracking

### Clearing Data
User can clear by:
1. Clicking "Restart Test" button
2. Clearing browser localStorage
3. Using browser's "Clear browsing data"

Developer can clear programmatically:
```typescript
localStorage.removeItem("universityId");
localStorage.removeItem("testResults");
```

---

## Performance Considerations

### State Updates
- Minimal re-renders through proper state structure
- Trial arrays updated immutably
- No unnecessary nested state

### Data Size
- ~18 trials × 2 conditions = 36 trial objects
- Each trial: ~100 bytes
- Total: ~3.6 KB
- localStorage limit: 5-10 MB
- **No concerns about storage limits**

### Computation
- All calculations done on results screen
- No real-time heavy computation during test
- Charts rendered once with cached data

---

## Debugging Data

### View in Console
```javascript
// Check localStorage
console.log(localStorage.getItem("universityId"));
console.log(JSON.parse(localStorage.getItem("testResults")));

// Check state (in React DevTools)
// Look for page.tsx component state
```

### Common Issues

**Issue**: Results not showing
- Check: `testResults` state in page.tsx
- Check: onComplete callback fired from TestScreen

**Issue**: Wrong calculations
- Check: Trial objects have correct data
- Check: Evaluation function logic
- Verify: Position-based comparison, not consecutive

**Issue**: Progress bar stuck
- Check: Progress calculation formula
- Check: Condition awareness (forward vs backward)

**Issue**: Data lost on refresh
- Expected: Test state is in-memory only
- Solution: Would need to add test state to localStorage
