# Architecture

## Technology Stack

### Frontend Framework
- **Next.js 16**: React framework with App Router
- **React 19**: Component-based UI library
- **TypeScript**: Type-safe JavaScript

### Styling
- **Tailwind CSS v4**: Utility-first CSS framework
- **Custom Fonts**: Roboto variable font

### Data Visualization
- **Chart.js 4.x**: Chart rendering library
- **react-chartjs-2**: React wrapper for Chart.js

### Icons & UI
- **lucide-react**: Icon library

## Project Structure

```
digit_span_test/
├── public/
│   ├── fonts/                    # Roboto font files
│   └── dhruv_profile_photo.jpg   # Profile photo
├── src/
│   ├── app/
│   │   ├── data/
│   │   │   ├── instructions.ts   # Instruction steps
│   │   │   └── sequences.ts      # Pre-generated digit sequences
│   │   ├── globals.css           # Global styles and font imports
│   │   ├── layout.tsx            # Root layout with metadata
│   │   ├── page.tsx              # Main app controller
│   │   └── types.ts              # TypeScript type definitions
│   └── components/
│       ├── WelcomeScreen.tsx     # ID input and disclaimer
│       ├── InstructionsScreen.tsx # Step-by-step instructions
│       ├── TestScreen.tsx        # Main test logic
│       ├── ResultsScreen.tsx     # Results display with graphs
│       └── ThankYouScreen.tsx    # Completion message
├── docs/                         # Documentation (this folder)
└── package.json                  # Dependencies and scripts
```

## Design Patterns

### State Management
Uses React's built-in state management:
- **Central State**: `page.tsx` manages app-wide state
- **Local State**: Each component manages its own UI state
- **Props Drilling**: Pass callbacks and data down the component tree

### Component Architecture
```
page.tsx (Controller)
├── WelcomeScreen (Data Entry)
├── InstructionsScreen (Information Display)
├── TestScreen (Test Logic & Execution)
├── ResultsScreen (Data Visualization)
└── ThankYouScreen (Completion)
```

### Data Flow
```
User Input → Component State → Central State → Results → Visualization
```

## Key Design Decisions

### 1. Pre-generated Sequences
**Why**: Ensure consistency and no consecutive duplicate digits
**How**: `sequences.ts` contains all digit arrays pre-generated
**Benefit**: Faster, more reliable, reproducible results

### 2. Client-Side Only
**Why**: Educational project, no need for backend
**How**: localStorage for persistence
**Benefit**: Simple deployment, privacy-friendly

### 3. Component-Based Screen Flow
**Why**: Clear separation of concerns
**How**: Each screen is a separate component controlled by AppState
**Benefit**: Easy to maintain, test, and modify

### 4. Position-Based Scoring
**Why**: More accurate than consecutive digit counting
**How**: Compare digit at position i in response with position i in sequence
**Benefit**: Proper assessment of working memory accuracy

## State Management Details

### App State (in page.tsx)
```typescript
type AppState = "welcome" | "instructions" | "test" | "results" | "thankyou"
```

Controls which screen is displayed.

### Test State (in TestScreen.tsx)
- Current condition (forward/backward)
- Current sequence length (2-10)
- Current trial number (1 or 2)
- Test phase (ready/display/input)
- User responses and accuracy

### Results State
- All trial data (forward and backward)
- Total correct responses
- Maximum span achieved
- Accuracy percentages

## Performance Considerations

### Image Loading
- Next.js Image component for optimized loading
- Priority loading for above-the-fold images

### Chart Rendering
- Charts only render on results screen
- Responsive design with proper aspect ratios

### State Updates
- Minimal re-renders through proper state structure
- Callbacks memoized where appropriate

## Browser Compatibility

### Required Features
- ES6+ JavaScript support
- localStorage API
- CSS Grid and Flexbox
- Modern color functions (for Tailwind v4)

### Tested Browsers
- Chrome/Edge (Chromium-based)
- Firefox
- Safari

## Deployment Considerations

### Static Export
Can be deployed as a static site:
```bash
npm run build
```

### Hosting Options
- Vercel (recommended for Next.js)
- Netlify
- GitHub Pages
- Any static hosting service

### Environment
- No environment variables needed
- No API keys required
- No backend services
