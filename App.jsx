@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * { box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; }
}

@layer utilities {
  .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
  .hide-scroll::-webkit-scrollbar { display: none; }
}
