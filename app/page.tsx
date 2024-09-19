import Image from "next/image";
import banner from "@/assets/images/home.png";
import Header from "./components/Header";

const Home: React.FC = () => {
  return (
    <div>
      <Header />
      <div className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between">
          <div className="max-w-xl mb-8 lg:mb-0 lg:w-1/2">
            <h2 className="text-blue-600 text-lg font-semibold">
              Welcome to EAGLE EYE
            </h2>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mt-4">
              The Sophisticated{" "}
              <span className="text-blue-600">and Innovative Stock</span>{" "}
              Exchange!
            </h1>
            <p className="text-gray-400 mt-4">
              We are thrilled to welcome you to EAGLE EYE, the leading stock
              exchange offering cutting-edge and effective investment solutions.
            </p>
            <div className="mt-8 flex space-x-4"></div>
          </div>

          <div className="w-full lg:w-1/2">
            <Image
              src={banner}
              alt="Home Banner"
              className="object-cover w-full h-auto"
              width={700}
              height={700}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
