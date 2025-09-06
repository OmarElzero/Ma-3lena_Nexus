import { Player } from "@lottiefiles/react-lottie-player";
import learnAnimation from "../assets/learn.json";
import { useState, useEffect } from "react";

export default function About() {
    const [currentFeature, setCurrentFeature] = useState(0);

    const features = [
        "Innovative Learning Methods",
        "Hands-on Visual Exploration",
        "Interactive 3D Concepts",
        "Engaging & Fun Experiences",
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFeature((prev) => (prev + 1) % features.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [features.length]);

    return (
        <section className="w-full h-auto bg-[#0D1B2A] flex flex-col items-center justify-center overflow-hidden relative">


            <div className="w-full flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-20 py-12 relative z-10">


                <div className="text-center md:text-left md:w-1/2 space-y-8 mt-10 md:mt-0">
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                            About{" "}
                            <span className="bg-gradient-to-r from-cyan-300 to-cyan-400 bg-clip-text text-transparent">
                                StoryLearn
                            </span>
                        </h1>

                        <div className="h-10 overflow-hidden">
                            <div
                                className="transition-transform duration-500 ease-in-out"
                                style={{ transform: `translateY(-${currentFeature * 2.5}rem)` }}
                            >
                                {features.map((feature, index) => (
                                    <p
                                        key={index}
                                        className="text-2xl md:text-3xl font-semibold text-white h-10"
                                    >
                                        {feature}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#1B263B]/40 p-6 rounded-2xl border border-cyan-300/30">
                        <p className="text-white text-base md:text-lg leading-relaxed">
                            StoryLearn is designed to revolutionize the way you learn. With interactive 3D visuals,
                            immersive experiences, and engaging storytelling, we make learning intuitive
                            and enjoyable. Explore concepts in a fun and interactive way, and elevate
                            your understanding to new heights.
                        </p>
                    </div>
                </div>

                {/* Animation Section */}
                <div className="md:w-[40%] flex justify-center mb-10 md:mb-0 relative">
                    <div className="rounded-2xl overflow-hidden w-72 md:w-96 lg:w-[28rem] relative z-10">
                        <Player autoplay loop src={learnAnimation} className="w-full h-full" />
                    </div>
                </div>
            </div>


            <div className="w-full px-6 md:px-20 py-12 grid md:grid-cols-2 gap-8">
                <div className="bg-[#1B263B]/40 p-6 rounded-2xl border border-cyan-300/30">
                    <h2 className="text-2xl font-bold text-cyan-300 mb-3">Our Mission</h2>
                    <p className="text-white text-base md:text-lg leading-relaxed">
                        To empower learners worldwide by making complex concepts simple, interactive,
                        and accessible through technology-driven storytelling.
                    </p>
                </div>
                <div className="bg-[#1B263B]/40 p-6 rounded-2xl border border-cyan-300/30">
                    <h2 className="text-2xl font-bold text-cyan-300 mb-3">Our Vision</h2>
                    <p className="text-white text-base md:text-lg leading-relaxed">
                        To become the go-to platform for immersive education, where learners of all ages
                        can explore knowledge in engaging and impactful ways.
                    </p>
                </div>
            </div>


            <div className="w-full px-6 md:px-20 py-12">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-10">
                    Why Choose <span className="text-cyan-300">StoryLearn?</span>
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { title: "3D Visual Learning", desc: "Understand complex topics through interactive 3D experiences." },
                        { title: "Engaging Stories", desc: "Learn in a fun, story-driven environment that keeps you motivated." },
                        { title: "Accessible Anywhere", desc: "Available on multiple devices for flexible learning." },
                        { title: "Personalized Learning", desc: "Adaptive content tailored to your pace and style." },
                        { title: "Community Support", desc: "Collaborate with peers and learn together." },
                        { title: "Future-Ready Skills", desc: "Gain practical knowledge to excel in real-world scenarios." },
                    ].map((benefit, i) => (
                        <div key={i} className="bg-[#1B263B]/40 p-6 rounded-2xl border border-cyan-300/30 hover:scale-105 transition-transform">
                            <h3 className="text-xl font-semibold text-cyan-300 mb-2">{benefit.title}</h3>
                            <p className="text-white text-sm md:text-base">{benefit.desc}</p>
                        </div>
                    ))}
                </div>
            </div>


        </section>
    );
}
