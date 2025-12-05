import Image from "next/image";
import Link from "next/link";

interface LogoIconProps {
    size?: 'sm' | 'lg' | 'xl',
    className? : string
}

const LogoIcon = () => {
  return (
    <>
      <Link href="/" aria-label="home" className="flex items-center gap-3">
        <Image src={"/logo-light.svg"} alt="logo" width={30} height={30} />
        {/* render this logo in dark mode */}
        <Image src={"/logo-dark.svg"} alt="logo" width={30} height={30} />
        
        <span className="text-xl font-semibold">Revo</span>
      </Link>
    </>
  );
};

export default LogoIcon;
