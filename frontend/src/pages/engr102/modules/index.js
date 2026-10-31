// Registry of all 12 ENGR 102 Modules
import Mod1Content from './Mod1Content.jsx';
import Mod2Content from './Mod2Content.jsx';
import Mod3Content from './Mod3Content.jsx';
import Mod4Content from './Mod4Content.jsx';
import Mod5Content from './Mod5Content.jsx';
import Mod6Content from './Mod6Content.jsx';
import Mod7Content from './Mod7Content.jsx';
import Mod8Content from './Mod8Content.jsx';
import Mod9Content from './Mod9Content.jsx';
import Mod10Content from './Mod10Content.jsx';
import Mod11Content from './Mod11Content.jsx';
import Mod12Content from './Mod12Content.jsx';

export const MODULES = [
  {
    id: 1,
    slug: 'module1',
    number: 1,
    title: "Introduction to Computing and Python",
    Component: Mod1Content,
  },
  {
    id: 2,
    slug: 'module2',
    number: 2,
    title: "Variables and Expressions",
    Component: Mod2Content,
  },
  {
    id: 3,
    slug: 'module3',
    number: 3,
    title: "Types and Strings",
    Component: Mod3Content,
  },
  {
    id: 4,
    slug: 'module4',
    number: 4,
    title: "Boolean Expressions and Conditionals",
    Component: Mod4Content,
  },
  {
    id: 5,
    slug: 'module5',
    number: 5,
    title: "Program Design & Testing",
    Component: Mod5Content,
  },
  {
    id: 6,
    slug: 'module6',
    number: 6,
    title: "Loops",
    Component: Mod6Content,
  },
  {
    id: 7,
    slug: 'module7',
    number: 7,
    title: "Lists",
    Component: Mod7Content,
  },
  {
    id: 8,
    slug: 'module8',
    number: 8,
    title: "Top-Down Design & Dictionaries",
    Component: Mod8Content,
  },
  {
    id: 9,
    slug: 'module9',
    number: 9,
    title: "User-Defined Functions & Mutable/Immutable Data Types",
    Component: Mod9Content,
  },
  {
    id: 10,
    slug: 'module10',
    number: 10,
    title: "Exceptions & Errors",
    Component: Mod10Content,
  },
  {
    id: 11,
    slug: 'module11',
    number: 11,
    title: "Files",
    Component: Mod11Content,
  },
  {
    id: 12,
    slug: 'module12',
    number: 12,
    title: "Python Modules",
    Component: Mod12Content,
  },
];

export function getModuleById(id) {
  if (!id) return null;
  const num = parseInt(String(id).replace(/[^0-9]/g, ''), 10);
  if (isNaN(num)) return null;
  return MODULES.find((m) => m.id === num) || null;
}
