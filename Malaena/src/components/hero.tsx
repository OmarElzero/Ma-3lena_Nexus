import { Player } from "@lottiefiles/react-lottie-player";
import animationData from "../assets/cubes.json";
import { useState, useEffect } from "react";

export default function Hero() {
    const [currentFeature, setCurrentFeature] = useState(0);

    const features = [
        "Interactive 3D Learning",
        "Visual Concept Exploration",
        "Engaging Story Format",
        "Immersive Experiences"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFeature((prev) => (prev + 1) % features.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [features.length]);

    return (
        <section className="w-full h-auto bg-[#0D1B2A]   flex items-center   p-6  ustify-center overflow-hidden relative">




            <div className="w-full flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-20 relative z-10">

                <div className="text-center md:text-left md:w-1/2 space-y-8 mt-10 md:mt-0">
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                            Welcome to Our{" "}
                            <span className="bg-gradient-to-r from-cyan-300 to-cyan-400 bg-clip-text text-transparent">
                                Platform
                            </span>
                        </h1>

                        <div className="h-10 overflow-hidden">
                            <div
                                className="transition-transform duration-500 ease-in-out"
                                style={{ transform: `translateY(-${currentFeature * 2.5}rem)` }}
                            >
                                {features.map((feature, index) => (
                                    <p key={index} className="text-2xl md:text-3xl font-semibold text-white h-10">
                                        {feature}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>


                    <div className="bg-[#1B263B]/40 p-6 rounded-2xl border border-cyan-300/30">
                        <p className="text-white text-base md:text-lg">
                            Dive into our immersive 3D story learning process. Experience concepts in a visual and
                            interactive way, making learning fun and engaging.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start py-4">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-300 to-cyan-400 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                            <button className="relative  w-full px-8 py-4 bg-[#1B263B] rounded-2xl font-bold text-white text-md flex items-center justify-center gap-3 border border-cyan-300/50 shadow-lg transition-all duration-300 group-hover:scale-105 active:scale-95">
                                <span>Get Started</span>
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none"
                                     stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                </svg>
                            </button>
                        </div>

                        <button className="px-8 py-4 bg-transparent rounded-2xl font-bold text-white text-lg flex items-center   justify-center gap-3 border border-cyan-300 hover:border-cyan-400 transition-colors duration-300">
                            <span>View Demo</span>
                        </button>
                    </div>
                </div>


                <div className="md:w-[40%] flex justify-center mb-10 md:mb-0 relative">
                    <div className="rounded-2xl overflow-hidden w-72 md:w-96 lg:w-[28rem] relative z-10">
                        <Player
                            autoplay
                            loop
                            src={animationData}
                            className="w-full h-full"
                        />
                    </div>


                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-cyan-300/10 rounded-full blur-xl"></div>
                    <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-cyan-300/10 rounded-full blur-xl"></div>
                </div>
            </div>



        </section>
    );
}
