export const Quote = () => {
  return (
    <div className="bg-slate-200 h-screen flex justify-center flex-col">
      <div className="flex justify-center">
        <div className="max-w-lg">
          <div className="text-3xl font-bold">
            "The customer support I received was exceptional. The support team
            went above and beyond to address my concerns."
          </div>
          <div className="max-w-md text-xl font-semibold mt-4">
            Gourav Ghosh
          </div>
          <div className="max-w-md text-sm font-semibold text-slate-400">
            CEO | Arsalan inc
          </div>
        </div>
      </div>
    </div>
  );
};

//height = 100vh means the complete height of the current window, h-screen is the class for it in tailwind
