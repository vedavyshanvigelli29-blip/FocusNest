/**
 * taskContextObject.js
 *
 * Exports only the raw TaskContext object (created by createContext).
 * Keeping this in its own non-JSX file means TaskContext.jsx can be
 * component-only, satisfying Vite Fast Refresh's requirement that
 * .jsx files export either only components OR only hooks/values.
 */
import { createContext } from 'react';

export const TaskContext = createContext(null);
