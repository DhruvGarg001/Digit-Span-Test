# Test Flow

This document explains how the digit span test works from start to finish, both from the user's perspective and the technical implementation.

## User Journey

### 1. Welcome Screen
**What User Sees**:
- Title: "Digit Span Test"
- University ID input field
- Profile photo and project information
- Links to documentation

**User Actions**:
- Enter University ID
- Click "Begin Experiment"

**What Happens**:
- ID saved to localStorage
- AppState changes to "instructions"

---

### 2. Instructions (4 Steps)

#### Step 1: Overview
- Explains what a digit span test is
- Mentions forward and backward conditions
- Duration estimate: ~5 minutes

#### Step 2: Forward Span Instructions
- Explains forward digit recall
- Shows example: `3-7-9-2` → type `3792`
- Tips for remembering

#### Step 3: Backward Span Instructions
- Explains backward digit recall
- Shows example: `3-7-9-2` → type `2973`
- Additional tips for reversing

#### Step 4: Final Tips
- Stay focused
- Take your time
- Reassurance that it gets harder

**User Actions**:
- Press Spacebar or click "Next" to advance
- Progress bar shows current step

**What Happens**:
- After step 4, AppState changes to "test"

---

### 3. Forward Digit Span Test

#### Introduction Screen
**What User Sees**:
- "Forward Digit Span" heading
- Explanation of task
- Example shown
- "Begin Forward Test" button

#### Test Trials (18 total)
- 2 trials each at lengths: 2, 3, 4, 5, 6, 7, 8, 9, 10

#### Each Trial Flow:

**Phase 1: Ready**
- Screen shows: "Get Ready!"
- Shows sequence length (e.g., "Sequence Length: 5")
- Lasts 1 second

**Phase 2: Display**
- Digits appear one at a time
- Large white text on dark background
- 1 second per digit
- Example timing for 5 digits:
  - `3` (1 sec)
  - `7` (1 sec)
  - `9` (1 sec)
  - `2` (1 sec)
  - `5` (1 sec)

**Phase 3: Input**
- Text input field appears
- Prompt: "Enter the digits in the same order"
- Shows trial number: "Trial 1 of 2 at this length"
- User types response
- Clicks "Submit" or presses Enter

**What Happens After Submit**:
- Response evaluated
- Correct digits counted (position-by-position)
- Result stored
- Automatically moves to next trial
- Progress bar updates

---

### 4. Backward Digit Span Test

#### Introduction Screen
**What User Sees**:
- "Backward Digit Span" heading
- Explanation that order is REVERSED
- Yellow warning box emphasizing reverse order
- Example shown
- "Begin Backward Test" button

#### Test Trials (18 total)
Same structure as forward test, but:
- Evaluation compares response to REVERSED sequence
- Example: See `3-7-9-2` → Expected: `2-9-7-3`

---

### 5. Results Screen

**What User Sees**:

#### Header
- "Test Complete!"
- Participant ID
- Completion timestamp

#### Summary Cards (Side by Side)

**Forward Digit Span Card**:
- Total Trials: 18
- Fully Correct: X
- Success Rate: X%
- Maximum Span: X
- Correct Digits Placed: X / 110 (X%)

**Backward Digit Span Card**:
- Same statistics for backward condition

#### Graph 1: Digit Placement Accuracy
Bar chart showing:
- Gray bars: Total digits shown (110 per condition)
- Green bars: Correct digits placed
- Side-by-side comparison

#### Graph 2: Maximum Span Achieved
Bar chart showing:
- Maximum sequence length correctly recalled
- Scale 0-10
- Color-coded by condition

#### Collapsible: Graph Calculation Details
Click to expand explanations of:
- How accuracy is calculated
- Example calculations
- Position-based matching explanation
- Max span determination

#### Collapsible: Detailed Trial Results

**Forward Trials** (Click to expand):
- All 18 trials listed
- Each shows: sequence → user response (correct/total) ✓/✗

**Backward Trials** (Click to expand):
- All 18 trials listed
- Shows: sequence → reversed sequence → user response

#### Action Buttons
- **Restart Test**: Clear all data and start over
- **Done**: Go to thank you screen

---

### 6. Thank You Screen

**What User Sees**:
- "Thank You"
- "Your participation is complete."
- "You may now close this window."

**User Actions**:
- Close browser tab/window

---

## Technical Flow

### State Transitions

```
welcome → instructions → test → results → thankyou
   ↑                                ↓
   └────────── restart ─────────────┘
```

### Data Flow Through Test

#### Starting a Trial
1. Get sequence from `sequences.ts`
2. Set phase to "ready"
3. After 1 second → Set phase to "display"

#### Displaying Digits
1. Set displayIndex to 0
2. Show sequence[displayIndex]
3. After 1 second → Increment displayIndex
4. Repeat until all digits shown
5. Set phase to "input"

#### Processing Input
1. User types response
2. Click Submit
3. Evaluate:
   ```typescript
   const correctDigits = calculateCorrectDigits(
     sequence,
     userInput,
     isBackward
   );
   const isFullyCorrect = correctDigits === sequence.length;
   ```
4. Store Trial object:
   ```typescript
   {
     sequence: [3, 7, 9, 2],
     userResponse: "3792",
     correctDigits: 4,
     isFullyCorrect: true,
     length: 4
   }
   ```

#### Moving to Next Trial
1. Check if current trial < 2:
   - If yes: Stay at same length, trial++
   - If no: Move to next length, reset trial to 1
2. Check if at max length:
   - If yes and both trials done:
     - Check condition:
       - If forward: Switch to backward
       - If backward: Call onComplete()

### Progress Calculation

```typescript
// Forward condition
const forwardTrials = (currentLength - MIN_LENGTH) * 2 + currentTrial;
const progress = (forwardTrials / totalTrials) * 100;

// Backward condition
const backwardTrials = (currentLength - MIN_LENGTH) * 2 + currentTrial;
const totalForward = (MAX_LENGTH - MIN_LENGTH + 1) * 2;
const progress = ((totalForward + backwardTrials) / totalTrials) * 100;
```

### Evaluation Algorithm

```typescript
function calculateCorrectDigits(sequence, userInput, isBackward) {
  const expectedSequence = isBackward ? [...sequence].reverse() : sequence;
  const userDigits = userInput.split("");
  
  let correctCount = 0;
  for (let i = 0; i < expectedSequence.length; i++) {
    if (userDigits[i] === expectedSequence[i].toString()) {
      correctCount++;
    }
  }
  
  return correctCount;
}
```

**Key Point**: Compares position-by-position, NOT consecutive matches.

Example:
- Expected: `3792`
- User types: `3972`
- Comparison:
  - Position 0: `3` === `3` ✓
  - Position 1: `9` !== `7` ✗
  - Position 2: `7` !== `9` ✗
  - Position 3: `2` === `2` ✓
- Result: 2 correct digits

### Results Calculation

#### Total Trials
```typescript
forwardTotalResponses = forwardTrials.length; // Always 18
```

#### Fully Correct Count
```typescript
forwardTotalCorrect = forwardTrials.filter(t => t.isFullyCorrect).length;
```

#### Maximum Span
```typescript
forwardMaxSpan = Math.max(
  ...forwardTrials.filter(t => t.isFullyCorrect).map(t => t.length),
  0
);
```

#### Digit Accuracy
```typescript
totalDigitsShown = forwardTrials.reduce((sum, t) => sum + t.length, 0);
correctDigitsPlaced = forwardTrials.reduce((sum, t) => sum + t.correctDigits, 0);
accuracy = (correctDigitsPlaced / totalDigitsShown) * 100;
```

---

## Timing Breakdown

### Full Experiment Duration

**Instructions**: ~2-3 minutes
- 4 steps, user-paced

**Forward Test**: ~3-4 minutes
- 18 trials
- Average 10-15 seconds per trial

**Backward Test**: ~3-4 minutes
- 18 trials
- Slightly longer as task is harder

**Results Review**: ~2-5 minutes
- User-paced

**Total**: Approximately 10-15 minutes

### Per Trial Timing

For a sequence of length N:
- Ready phase: 1 second
- Display phase: N seconds (1 per digit)
- Input phase: Variable (5-30 seconds typical)
- **Total**: N + 6 to N + 31 seconds per trial

---

## Edge Cases Handled

### Empty Input
- "Submit" button triggers form validation
- User must enter something

### Wrong Length Input
- Still evaluated position-by-position
- Extra digits ignored
- Missing positions count as incorrect

### Non-Numeric Input
- No validation currently
- Will count as incorrect during evaluation

### Browser Refresh
- localStorage preserves University ID
- Test progress is lost (must restart)

### Skipping Instructions
- Not possible - must go through all steps
- Could be added via keyboard shortcut if needed
