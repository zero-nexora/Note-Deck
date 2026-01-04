export function PageBackground() {
  return (
    <>
      <div className="light-ray" />
      <div className="floating-orb w-96 h-96 top-20 -left-48 animate-pulse-slow" />
      <div className="floating-orb w-64 h-64 bottom-20 -right-32 animate-pulse-slow animation-delay-400" />
    </>
  );
}


// export function PageBackground() {
//   return (
//     <>
//       <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />

//       <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

//       <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
//     </>
//   );
// }
