# Customization Guide

This guide shows how to modify common aspects of the digit span test.

## Common Customizations

### 1. Change Sequence Lengths

**File**: `src/components/TestScreen.tsx`

**Current**:
```typescript
const MIN_LENGTH = 2;  // Start with 2 digits
const MAX_LENGTH = 10; // End with 10 digits
```

**To Change**:
```typescript
const MIN_LENGTH = 3;  // Start with 3 digits
const MAX_LENGTH = 8;  // End with 8 digits
```

**Note**: You'll also need to update `sequences.ts` to have data for your chosen range.

---

### 2. Change Number of Trials Per Length

**File**: `src/components/TestScreen.tsx`

**Current**:
```typescript
const TRIALS_PER_LENGTH = 2;
```

**To Change**:
```typescript
const TRIALS_PER_LENGTH = 3; // 3 trials at each length
```

**Impact**:
- More trials = more reliable data
- Longer test duration
- More data points in results

---

### 3. Change Digit Display Timing

**File**: `src/components/TestScreen.tsx`

**Current**:
```typescript
// Ready phase
setTimeout(() => {
  setPhase("display");
}, 1000);  // 1 second

// Display phase
setTimeout(() => {
  // Next digit
}, 1000);  // 1 second per digit
```

**To Change**:
```typescript
// Faster: 500ms per digit
setTimeout(() => { ... }, 500);

// Slower: 1.5s per digit
setTimeout(() => { ... }, 1500);
```

**Recommendation**: Keep at 1000ms (standard in psychology research).

---

### 4. Modify Instructions

**File**: `src/app/data/instructions.ts`

**Current**: 4 instruction steps

**To Add a Step**:
```typescript
export const instructions = [
  // Existing steps...
  {
    step: 5,
    title: "New Instruction",
    content: "Your custom instruction text here."
  }
];
```

**To Modify Existing**:
Just edit the `content` field of any step.

**Note**: If you change the number of steps, update the check in `InstructionsScreen.tsx`:
```typescript
{currentStep < instructions.length - 1 ? (
  <button onClick={onNext}>...</button>
) : (
  <button onClick={onNext}>...</button>
)}
```

---

### 5. Change Color Scheme

**Current Colors**:
- Primary green: `#18543a`
- Hover green: `#134430`

**Files to Update**:

#### `src/app/globals.css`
```css
:root {
  --dark-green-color: #18543a;
  --hover-dark-green-color: #134430;
}
```

Change these values to your preferred colors.

#### Component Files
Search for `#18543a` and `#134430` and replace with new colors.

**Quick Find & Replace**:
1. Search: `#18543a`
2. Replace with: `#yourcolor`
3. Search: `#134430`
4. Replace with: `#yourhovercolor`

---

### 6. Add Early Stopping Rule

Some digit span tests stop early if participant fails both trials at a length.

**File**: `src/components/TestScreen.tsx`

**Add to `processNextStep` function**:
```typescript
// After processing a trial
if (currentTrial === 2) {
  // Check if both trials at this length were incorrect
  const trial1 = condition === "forward" 
    ? forwardTrials[forwardTrials.length - 2]
    : backwardTrials[backwardTrials.length - 2];
  const trial2 = condition === "forward"
    ? forwardTrials[forwardTrials.length - 1]
    : backwardTrials[backwardTrials.length - 1];
    
  if (!trial1.isFullyCorrect && !trial2.isFullyCorrect) {
    // Both failed, stop early
    if (condition === "forward") {
      // Move to backward condition
      setCondition("backward");
      setCurrentLength(MIN_LENGTH);
      setCurrentTrial(1);
    } else {
      // Test complete
      handleTestComplete();
    }
    return;
  }
}
```

---

### 7. Remove Backward Span

To create a forward-only test:

**File**: `src/components/TestScreen.tsx`

**In `processNextStep` function**, change:
```typescript
if (currentLength > MAX_LENGTH) {
  if (condition === "forward") {
    // Move to backward
    setCondition("backward");
    setCurrentLength(MIN_LENGTH);
    setCurrentTrial(1);
  } else {
    handleTestComplete();
  }
}
```

**To**:
```typescript
if (currentLength > MAX_LENGTH) {
  // Skip backward, go straight to completion
  handleTestComplete();
}
```

**Also update `TestResults` type** in `src/app/types.ts` to make backward fields optional or remove them.

---

### 8. Change Graph Styles

**File**: `src/components/ResultsScreen.tsx`

**Chart Colors**:
```typescript
// In correctDigitsData
backgroundColor: "rgba(24, 84, 58, 0.8)",  // Change this
borderColor: "rgba(24, 84, 58, 1)",        // And this

// In maxSpanData
backgroundColor: ["rgba(24, 84, 58, 0.8)", "rgba(79, 70, 229, 0.8)"],
```

**Chart Options**:
```typescript
const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,  // Set to false for custom sizing
  plugins: {
    legend: {
      position: "top" as const,  // Change to "bottom", "left", "right"
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1  // Change step size
      }
    }
  }
};
```

---

### 9. Add Audio Feedback

For accessibility or enhanced experience:

**Install Audio Library** (optional):
```bash
npm install use-sound
```

**Add to TestScreen.tsx**:
```typescript
const playBeep = () => {
  const audio = new Audio('/beep.mp3');
  audio.play();
};

// In display phase, before showing digit
playBeep();
```

**Add audio file** to `public/beep.mp3`

---

### 10. Export Results as CSV

Add a download button in ResultsScreen:

```typescript
const downloadCSV = () => {
  const rows = [
    ["Trial", "Condition", "Length", "Sequence", "Response", "Correct Digits", "Fully Correct"],
    ...results.forwardTrials.map((t, i) => [
      i + 1,
      "Forward",
      t.length,
      t.sequence.join(""),
      t.userResponse,
      t.correctDigits,
      t.isFullyCorrect
    ]),
    ...results.backwardTrials.map((t, i) => [
      i + 1,
      "Backward",
      t.length,
      t.sequence.join(""),
      t.userResponse,
      t.correctDigits,
      t.isFullyCorrect
    ])
  ];
  
  const csv = rows.map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `digit-span-${results.universityId}.csv`;
  link.click();
};
```

---

### 11. Add Practice Trials

Before the actual test:

**File**: `src/components/TestScreen.tsx`

**Add state**:
```typescript
const [isPractice, setIsPractice] = useState(true);
const [practiceComplete, setPracticeComplete] = useState(false);
```

**Add practice sequence**:
```typescript
const PRACTICE_SEQUENCE = ["3", "7", "9"];
```

**Modify flow**:
```typescript
if (isPractice) {
  // Use PRACTICE_SEQUENCE
  // Don't save results
  // After completion, setIsPractice(false)
} else {
  // Normal test flow
}
```

---

### 12. Customize Welcome Message

**File**: `src/components/WelcomeScreen.tsx`

Change:
```typescript
<h1 className="text-center text-3xl font-bold text-gray-900 mb-2">
  Digit Span Test
</h1>
<p className="text-center text-md text-gray-600 max-w-2xl">
  An online psychology experiment designed to measure working memory capacity
</p>
```

To your preferred title and description.

---

### 13. Add Timer/Time Pressure

Add countdown timer during input phase:

```typescript
const [timeRemaining, setTimeRemaining] = useState(30); // 30 seconds

useEffect(() => {
  if (phase === "input" && timeRemaining > 0) {
    const timer = setTimeout(() => {
      setTimeRemaining(timeRemaining - 1);
    }, 1000);
    return () => clearTimeout(timer);
  } else if (timeRemaining === 0) {
    // Auto-submit with current input
    handleSubmit();
  }
}, [phase, timeRemaining]);
```

Display timer:
```tsx
{phase === "input" && (
  <p>Time remaining: {timeRemaining}s</p>
)}
```

---

### 14. Change Font

**File**: `src/app/globals.css`

**Current**: Roboto

**To change**:
1. Add new font file to `public/fonts/`
2. Update `@font-face` in globals.css:
```css
@font-face {
  font-family: "YourFont";
  src: url("/fonts/yourfont.ttf") format("truetype");
}
```
3. Update body:
```css
body {
  font-family: "YourFont", sans-serif;
}
```

---

### 15. Accessibility Improvements

**Add keyboard navigation**:
```typescript
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter" && phase === "input") {
      handleSubmit();
    }
  };
  window.addEventListener("keydown", handleKeyPress);
  return () => window.removeEventListener("keydown", handleKeyPress);
}, [phase]);
```

**Add ARIA labels**:
```tsx
<input
  aria-label="Enter digit sequence"
  aria-describedby="instruction-text"
  ...
/>
```

**Add focus management**:
```typescript
const inputRef = useRef<HTMLInputElement>(null);

useEffect(() => {
  if (phase === "input") {
    inputRef.current?.focus();
  }
}, [phase]);
```

---

## Advanced Customizations

### Add Different Test Types

Create variations like:
- Spatial span (remembering positions)
- Letter span (letters instead of digits)
- Operation span (math problems between items)

Would require:
- New sequence generation in `sequences.ts`
- Modified display logic in `TestScreen.tsx`
- Updated evaluation function

### Add User Accounts

Would require:
- Backend server (Node.js, Python, etc.)
- Database (PostgreSQL, MongoDB, etc.)
- Authentication system
- API endpoints for saving/loading data

### Multi-Language Support

Add translation files:
```typescript
// src/locales/en.ts
export const en = {
  welcome: {
    title: "Digit Span Test",
    // ...
  }
};

// src/locales/es.ts
export const es = {
  welcome: {
    title: "Prueba de Memoria de Dígitos",
    // ...
  }
};
```

Use context/hooks to switch languages.

---

## Testing Changes

After making changes:

1. **Run dev server**:
```bash
npm run dev
```

2. **Test complete flow**:
- Enter ID
- Go through instructions
- Complete both tests
- View results

3. **Check edge cases**:
- Empty input
- Very long/short input
- Browser refresh
- Restart functionality

4. **Verify calculations**:
- Check trial data in console
- Verify graph values
- Test with known inputs

5. **Test on different browsers**:
- Chrome
- Firefox
- Safari
- Edge

---

## Getting Help

If you're stuck:
1. Check the relevant documentation file
2. Look at the component code
3. Check console for errors
4. Use React DevTools to inspect state
5. Refer to Next.js or React documentation

## Contributing

If you make useful modifications, consider:
- Documenting your changes
- Adding comments to code
- Updating this documentation
- Sharing with others
