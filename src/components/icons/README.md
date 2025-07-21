# Icon Components

This directory contains reusable icon components that have been extracted from inline SVG elements throughout the application.

## Available Icons

### SpinnerIcon

- **Usage**: Loading/spinning indicator
- **Props**: `className` (optional)
- **Example**: `<SpinnerIcon className="animate-spin h-4 w-4" />`

### SuccessIcon

- **Usage**: Success messages and completed status indicators
- **Props**: `className` (optional)
- **Example**: `<SuccessIcon className="w-5 h-5 mr-2" />`

### ErrorIcon

- **Usage**: Error messages and warning indicators
- **Props**: `className` (optional)
- **Example**: `<ErrorIcon className="w-5 h-5 mr-2" />`

### PlusIcon

- **Usage**: Add/create actions
- **Props**: `className` (optional)
- **Example**: `<PlusIcon className="w-5 h-5 mr-2" />`

### DownloadIcon

- **Usage**: Download actions (PDF reports)
- **Props**: `className` (optional)
- **Example**: `<DownloadIcon className="w-5 h-5 mr-2" />`

### DeleteIcon

- **Usage**: Delete/remove actions
- **Props**: `className` (optional)
- **Example**: `<DeleteIcon className="h-4 w-4" />`

### CheckmarkIcon

- **Usage**: Completed task status
- **Props**: `className` (optional)
- **Example**: `<CheckmarkIcon className="h-4 w-4" />`

### PendingIcon

- **Usage**: Pending task status
- **Props**: `className` (optional)
- **Example**: `<PendingIcon className="h-4 w-4" />`

## Usage

Import icons from the icons directory:

```tsx
import { SpinnerIcon, SuccessIcon, ErrorIcon } from "./icons";
```

All icons accept a `className` prop for styling and use `currentColor` for their fill/stroke, making them easy to style with CSS classes.

## Migration

All inline SVG elements have been replaced with these reusable icon components to improve:

- Code reusability
- Maintainability
- Consistency across the application
- Bundle size optimization
