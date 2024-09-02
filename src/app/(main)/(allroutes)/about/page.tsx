import { ScrollArea } from "@/components/ui/scroll-area";

export default function AboutPage() {
  return (
    <ScrollArea className="h-[900px]">
      <div className="flex justify-center items-center bg-white">
        <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#4c5cfc] to-[#b880fc] mb-6">
            About Us
          </h1>

          <p className="text-lg text-gray-800 mb-4">
            Welcome to EasyRAG, where we empower your data journey with
            cutting-edge tools and technologies designed to enhance your chatbot
            experience. Our mission is to democratize data accessibility by
            offering an easy-to-use platform that allows you to create custom
            chatbots with industry-standard customizations, all without breaking
            the bank.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Story</h2>
          <p className="text-lg text-gray-800 mb-4">
            Born out of the need to overcome the limitations of existing chatbot
            solutions, EasyRAG was created with a vision to offer a versatile
            and powerful platform. Whether you&apos;re tired of rate limits or
            looking to make custom queries on your own documents, EasyRAG is
            here to provide a solution. We believe in giving everyone the
            ability to harness the power of LLMs (Large Language Models) without
            the complexity and cost usually associated with these technologies.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">What We Do</h2>
          <p className="text-lg text-gray-800 mb-4">
            At EasyRAG, we provide a unique SDK that allows you to embed custom
            chatbots directly into your website via TypeScript code. Our
            platform is the first of its kind, offering seamless integration
            with your existing systems, whether it is uploading your document
            corpuses or connecting your own database, while giving you full
            control over your chatbot&apos;s training data. By connecting to
            your own database, you can train chatbots that are not only tailored
            to your specific needs but also continually learn and adapt over
            time.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Our Features
          </h2>
          <ul className="list-disc list-inside text-lg text-gray-800 mb-4">
            <li>
              Custom Chatbot Creation: Choose your favorite LLM, upload your
              documents, and train a chatbot free of cost.
            </li>
            <li>
              Data Control: Insert or delete context on the fly with our
              easy-to-use SDK.
            </li>
            <li>
              Versatile Integration: Generate a website embedding to insert your
              custom chatbot into your site seamlessly.
            </li>
            <li>
              Advanced Tech Stack: Utilize top-tier embedding models and LLMs
              with a robust backend powered by Convex.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h2>
          <p className="text-lg text-gray-800 mb-4">
            We believe in the power of data equity. By enabling the use of free
            LLMs, we&apos;re democratizing access to advanced data processing
            and inferential capabilities. Our platform supports a wide range of
            input formats, ensuring that no matter your data source, you can
            leverage EasyRAG to its fullest potential.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">Join Us</h2>
          <p className="text-lg text-gray-800 mb-4">
            As we continue to grow and revolutionize the way the world interacts
            with data, we invite you to join us on this exciting journey. At
            EasyRAG, we&apos;re not just creating tools—we&apos;re building a
            community of innovators and forward-thinkers who are ready to unlock
            the future of chatbot technology.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
          <p className="text-lg text-gray-800">
            Ready to get started or have any questions? Reach out to us today
            and let’s explore how EasyRAG can transform your data into
            actionable insights.
          </p>
        </div>
      </div>
    </ScrollArea>
  );
}
