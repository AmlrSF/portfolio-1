import React from "react";
import { AnimatePresence, motion } from "framer-motion";

import { CanvasRevealEffect } from "./ui/CanvasRevealEffect";

const Approach = () => {
  return (
    <section className="w-full py-20">
      <h1 className="heading">
        My <span className="text-purple">creative process</span>
      </h1>
      {/* remove bg-white dark:bg-black */}
      <div className="my-20 flex flex-col lg:flex-row items-center justify-center w-full gap-4">
        {/* add des prop */}
        <Card
          title="Concept & Research"
          icon={<AceternityIcon order="Phase 1" />}
          des="We'll explore your vision, target audience, and brand identity. 
          I research trends, gather inspiration, and develop creative concepts 
          that align with your goals and aesthetic preferences."
        >
          <CanvasRevealEffect
            animationSpeed={5.1}
            // Creative orange-red gradient for ideation phase
            containerClassName="bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl overflow-hidden"
          />
        </Card>
        <Card
          title="Design & Iteration"
          icon={<AceternityIcon order="Phase 2" />}
          des="I create initial designs using Adobe Creative Suite and present 
          multiple concepts. Through collaborative feedback and iterations, 
          we refine the design until it perfectly captures your vision."
        >
          <CanvasRevealEffect
            animationSpeed={3}
            // Creative teal-blue gradient for design phase
            containerClassName="bg-gradient-to-r from-teal-500 to-blue-600 rounded-3xl overflow-hidden"
            colors={[
              // Bright, creative colors
              [0, 255, 255],
              [100, 200, 255],
            ]}
            dotSize={2}
          />
        </Card>
        <Card
          title="Finalization & Delivery"
          icon={<AceternityIcon order="Phase 3" />}
          des="Final touches are applied with attention to every detail. 
          I deliver high-quality files in all required formats, along with 
          brand guidelines if needed, ready for immediate use."
        >
          <CanvasRevealEffect
            animationSpeed={3}
            // Creative purple-pink gradient for completion phase
            containerClassName="bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl overflow-hidden"
            colors={[
              [255, 0, 150],
              [150, 0, 255]
            ]}
          />
        </Card>
      </div>
    </section>
  );
};

export default Approach;

const Card = ({
  title,
  icon,
  children,
  // add this one for the desc
  des,
}: {
  title: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  des: string;
}) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      // change h-[30rem] to h-[35rem], add rounded-3xl
      className="border border-black/[0.2] group/canvas-card flex items-center justify-center
       dark:border-white/[0.2]  max-w-sm w-full mx-auto p-4 relative lg:h-[35rem] rounded-3xl "
      style={{
        //   add these two with creative gradient
        background: "rgb(15,5,35)",
        backgroundColor:
          "linear-gradient(135deg, rgba(15,5,35,1) 0%, rgba(25,15,45,1) 50%, rgba(35,25,55,1) 100%)",
      }}
    >
      {/* Creative corner decorations */}
      <Icon className="absolute h-10 w-10 -top-3 -left-3 dark:text-white text-black opacity-30" />
      <Icon className="absolute h-10 w-10 -bottom-3 -left-3 dark:text-white text-black opacity-30" />
      <Icon className="absolute h-10 w-10 -top-3 -right-3 dark:text-white text-black opacity-30" />
      <Icon className="absolute h-10 w-10 -bottom-3 -right-3 dark:text-white text-black opacity-30" />

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full w-full absolute inset-0"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-20 px-10">
        <div
          // add this for making it center
          // absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]
          className="text-center group-hover/canvas-card:-translate-y-4 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] 
        group-hover/canvas-card:opacity-0 transition duration-200 min-w-40 mx-auto flex items-center justify-center"
        >
          {icon}
        </div>
        <h2
          // change text-3xl, add text-center
          className="dark:text-white text-center text-3xl opacity-0 group-hover/canvas-card:opacity-100
         relative z-10 text-black mt-4  font-bold group-hover/canvas-card:text-white 
         group-hover/canvas-card:-translate-y-2 transition duration-200"
        >
          {title}
        </h2>
        {/* add this one for the description */}
        <p
          className="text-sm opacity-0 group-hover/canvas-card:opacity-100
         relative z-10 mt-4 group-hover/canvas-card:text-white text-center
         group-hover/canvas-card:-translate-y-2 transition duration-200"
          style={{ color: "#E4ECFF" }}
        >
          {des}
        </p>
      </div>
    </div>
  );
};

// Creative phase indicator with artistic flair
const AceternityIcon = ({ order }: { order: string }) => {
  return (
    <div>
      {/* Creative button with artistic gradient */}
      <button className="relative inline-flex overflow-hidden rounded-full p-[1px] ">
        <span
          className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite]
         bg-[conic-gradient(from_90deg_at_50%_50%,#FF6B6B_0%,#4ECDC4_25%,#45B7D1_50%,#96CEB4_75%,#FF6B6B_100%)]"
        />
        <span
          className="inline-flex h-full w-full cursor-pointer items-center 
        justify-center rounded-full bg-slate-950 px-5 py-2 backdrop-blur-3xl font-bold text-2xl"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}
        >
          {order}
        </span>
      </button>
    </div>
  );
};

export const Icon = ({ className, ...rest }: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};