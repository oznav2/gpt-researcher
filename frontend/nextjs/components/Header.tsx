import Image from 'next/image';

const Header = () => {
  return (
    <div className="container h-[60px] px-4 lg:h-[80px] lg:px-0 pt-5 sm:pt-10">
      <div className="grid h-full grid-cols-12">
        <div className="col-span-5"></div>
        <div className="col-span-2 flex items-center justify-center">
          <a href="/" className="transition-transform hover:scale-105">
            <Image
              src="/img/logo.png"
              alt="logo"
              width={60}
              height={60}
              className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 dark:filter dark:invert"
            />
          </a>
        </div>
        <div className="col-span-5"></div>
      </div>
    </div>
  );
};

export default Header;