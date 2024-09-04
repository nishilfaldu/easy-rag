"use client"
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { motion } from 'framer-motion'
import Link from 'next/link'
import { InfoIcon } from 'lucide-react'

export default function AboutUs() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      <style jsx global>{`
        :root {
          --gradient-1: linear-gradient(40deg, #4c5cfc, #b880fc);
          --gradient-2: linear-gradient(45deg, #9333EA, #EC4899);
          --gradient-3: linear-gradient(45deg, #10B981, #3B82F6);
          --gradient-4: linear-gradient(45deg, #F59E0B, #F97316);
          --gradient-5: linear-gradient(45deg, #EF4444, #EC4899);
          --gradient-6: linear-gradient(45deg, #6366F1, #8B5CF6);
          --gradient-7: linear-gradient(45deg, #4c5cfc, #b880fc);
        }
        .gradient-text {
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: #4F46E5; /* Fallback color */
        }
      `}</style>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center mb-8">
          <InfoIcon className="w-6 h-6 mr-2 text-black" aria-hidden="true" />
          <motion.h1 
            className="text-xl md:text-2xl font-bold gradient-text"
            style={{ backgroundImage: 'var(--gradient-1)' }}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            About Us
          </motion.h1>
        </div>

        <motion.section 
          className="mb-6"
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeIn}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2 className="text-xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">Welcome to EasyRAG</h2>
          <p className="text-sm leading-relaxed">
            At EasyRAG, we empower your data journey with cutting-edge tools and technologies designed to enhance your chatbot experience. Our mission is to democratize data accessibility by offering an easy-to-use platform that allows you to create custom chatbots with industry-standard customizations, all without breaking the bank.
          </p>
        </motion.section>


        <motion.section 
          className="mb-6"
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeIn}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">Our Story</h2>
          <p className="text-sm leading-relaxed">
            Born out of the need to overcome the limitations of existing chatbot solutions, EasyRAG was created with a vision to offer a versatile and powerful platform. Whether you are tired of rate limits or looking to make custom queries on your own documents, EasyRAG is here to provide a solution. We believe in giving everyone the ability to harness the power of LLMs (Large Language Models) without the complexity and cost usually associated with these technologies.
          </p>
        </motion.section>

        <motion.section 
          className="mb-6"
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeIn}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">What We Do</h2>
          <p className="text-sm leading-relaxed">
            At EasyRAG, we provide a unique SDK that allows you to embed custom chatbots directly into your website via TypeScript code. Our platform is the first of its kind, offering seamless integration with your existing systems, whether it is uploading your document corpuses or connecting your own database, while giving you full control over your chatbot's training data. By connecting to your own database, you can train chatbots that are not only tailored to your specific needs but also continually learn and adapt over time.
          </p>
        </motion.section>

        <motion.section 
          className="mb-6"
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeIn}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-pink-500">Our Features</h2>
          <ul className="list-none space-y-2 text-sm">
            <li className="flex items-center">
              <span className="mr-2 text-base">🤖</span>
              <span>Custom Chatbot Creation: Choose your favorite LLM, upload your documents, and train a chatbot free of cost.</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-base">🔄</span>
              <span>Data Control: Insert or delete context on the fly with our easy-to-use SDK.</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-base">🔌</span>
              <span>Versatile Integration: Generate a website embedding to insert your custom chatbot into your site seamlessly.</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-base">🚀</span>
              <span>Advanced Tech Stack: Utilize top-tier embedding models and LLMs with a robust backend powered by Convex.</span>
            </li>
          </ul>
        </motion.section>

        <motion.section 
          className="mb-6"
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeIn}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">Our Vision</h2>
          <p className="text-sm leading-relaxed">
            We believe in the power of data equity. By enabling the use of free LLMs, we're democratizing access to advanced data processing and inferential capabilities. Our platform supports a wide range of input formats, ensuring that no matter your data source, you can leverage EasyRAG to its fullest potential.
          </p>
        </motion.section>

        <motion.section 
          className="text-center"
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeIn}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          
          <h2 className="text-2xl  font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">Join Us</h2>
          
          <p className="text-sm leading-relaxed mb-4">
            As we continue to grow and revolutionize the way the world interacts with data, we invite you to join us on this exciting journey. At EasyRAG, we are not just creating tools — we are building a community of innovators and forward-thinkers who are ready to unlock the future of chatbot technology.
          </p>
          
          <Link href="/home">
          <Button className="bg-gradient-to-r from-[#4c5cfc] to-[#b880fc] hover:from-blue-600 hover:to-teal-500 text-white font-semibold py-2 px-4 rounded-full text-sm transition-all duration-300 ease-in-out transform hover:scale-105">
            Get Started with EasyRAG
          </Button></Link>
        </motion.section>
      </div>
    </div>
  )
}