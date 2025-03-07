"use client";

export const ASCIIBackground = () => {
  const flowers = [
    { 
      content: `
        .-^-.
       /*@o@*\\
      |@*\\/*@|
      |@*/\\*@|
       \\@*@*/
        \`~'
      `,
      scale: 1.3,
      top: '10%',
      left: '15%',
      rotate: '0deg',
      opacity: 0.4
    },
    {
      content: `
         .~~.
        /++++\\
       |+@%o@+|
       |+@%%@+|
        \\+++/
         \`^'
      `,
      scale: 1.1,
      top: '25%',
      left: '80%',
      rotate: '5deg',
      opacity: 0.35
    },
    {
      content: `
        .-~-.
       /%o@%\\
      |%@*@%|
      |%\\|/%|
       \\%@%/
        \`^'
      `,
      scale: 0.9,
      top: '40%',
      left: '20%',
      rotate: '-3deg',
      opacity: 0.3
    },
    {
      content: `
         _/\\_
        /#o#\\
       |#*.*#|
       |#\\|/#|
        \\###/
         \`'
      `,
      scale: 1.5,
      top: '60%',
      left: '70%',
      rotate: '2deg',
      opacity: 0.25
    },
    {
      content: `
        .~~~.
       /@o@\\
      |@*.*@|
      |@\\|/@|
       \\@#@/
        \`^'
      `,
      scale: 1.2,
      top: '75%',
      left: '50%',
      rotate: '0deg',
      opacity: 0.4
    },
    {
      content: `
         .-.
        (@o@)
        |\\|/
        |%|
        ~^~
      `,
      scale: 0.8,
      top: '85%',
      left: '90%',
      rotate: '-5deg',
      opacity: 0.3
    },
    {
      content: `
        .-^-.
       /*@o@*\\
      |@*\\/*@|
      |@*/\\*@|
       \\@*@*/
        \`~'
      `,
      scale: 1.0,
      top: '50%',
      left: '30%',
      rotate: '3deg',
      opacity: 0.35
    }
  ];

  return (
    <div className="fixed inset-0 z-20 pointer-events-none overflow-hidden">
      {flowers.map((flower, index) => (
        <pre
          key={index}
          className="absolute whitespace-pre text-white/40 font-mono"
          style={{
            opacity: flower.opacity,
            top: flower.top,
            left: flower.left,
            transform: `scale(${flower.scale}) rotate(${flower.rotate})`,
            zIndex: 30 + index
          }}
        >
          {flower.content}
        </pre>
      ))}
    </div>
  );
}; 